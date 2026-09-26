// services/chat.service.ts
//
// Streams the assistant's reply token-by-token over SSE instead of waiting
// for the whole tool-use loop to finish. Uses the native fetch Streams API
// rather than HttpClient, since HttpClient doesn't expose a chunked
// text/event-stream body cleanly.

import { Injectable, signal } from '@angular/core';
import { ChatMessage, ChatStreamEvent, Product, TOOL_LABELS, ToolActivity } from '../../Features/shoppingAgent/model/agent.model';

@Injectable({ providedIn: 'root' })
export class ChatService {
  readonly messages = signal<ChatMessage[]>([]);
  readonly cartItemCount = signal<number>(0);

  /** Lets the UI show a "Stop" button and cancel an in-flight generation */
  private currentAbort: AbortController | null = null;
  readonly isStreaming = signal<boolean>(false);

  /**
   * A stable per-browser ID, independent of login state. The server's
   * resolveSession middleware reads this via the X-Session-Id header
   * instead of cookies/auth, since neither cookie-parser nor a global
   * `req.user` is set up in this app's server.js for this route.
   */
  private getOrCreateSessionId(): string {
    const key = 'shoppingSessionId';
    let id = localStorage.getItem(key);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(key, id);
    }
    return id;
  }

  async sendMessage(text: string): Promise<void> {
    if (this.isStreaming()) return; // one turn at a time keeps tool-call state sane

    const userMessage: ChatMessage = { role: 'user', text };
    const assistantMessage: ChatMessage = { role: 'assistant', text: '', waiting: true, streaming: true };
    this.messages.update((m) => [...m, userMessage, assistantMessage]);

    this.currentAbort = new AbortController();
    this.isStreaming.set(true);

    try {
      const response = await fetch('https://furni-back-end.onrender.com/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Id': this.getOrCreateSessionId(),
          ...(localStorage.getItem('token')
            ? { Authorization: `Bearer ${localStorage.getItem('token')}` }
            : {})
        },
        body: JSON.stringify({ message: text }),
        signal: this.currentAbort.signal
      });

      // If the server generated a fresh ID (e.g. first-ever request), save
      // it so subsequent messages reuse the same conversation history.
      const serverIssuedId = response.headers.get('X-Session-Id');
      if (serverIssuedId) localStorage.setItem('shoppingSessionId', serverIssuedId);

      if (!response.ok || !response.body) {
        throw new Error(`Request failed (${response.status})`);
      }

      await this.consumeStream(response.body);
    } catch (err: unknown) {
      if ((err as DOMException)?.name === 'AbortError') {
        this.patchLastAssistantMessage((m) => ({ ...m, streaming: false, waiting: false }));
      } else {
        this.patchLastAssistantMessage((m) => ({
          ...m,
          text: m.text || "Sorry, I couldn't process that just now — please try again.",
          streaming: false,
          waiting: false,
          error: true
        }));
      }
    } finally {
      this.isStreaming.set(false);
      this.currentAbort = null;
    }
  }

  stopStreaming(): void {
    this.currentAbort?.abort();
  }

  /** Reads the SSE body, decoding `data: {...}\n\n` frames as they arrive. */
  private async consumeStream(body: ReadableStream<Uint8Array>): Promise<void> {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const frames = buffer.split('\n\n');
      buffer = frames.pop() ?? ''; // keep the last, possibly incomplete frame

      for (const frame of frames) {
        const line = frame.trim();
        if (!line.startsWith('data:')) continue;

        const payload = line.slice('data:'.length).trim();
        if (!payload) continue;

        try {
          this.handleEvent(JSON.parse(payload) as ChatStreamEvent);
        } catch {
          // Ignore malformed frames rather than failing the whole stream
        }
      }
    }
  }

  private handleEvent(event: ChatStreamEvent): void {
    switch (event.type) {
      case 'text_delta':
        this.patchLastAssistantMessage((m) => ({
          ...m,
          text: m.text + event.text,
          waiting: false,
          activeToolLabel: undefined
        }));
        break;

      case 'tool_start':
        this.patchLastAssistantMessage((m) => ({
          ...m,
          waiting: false,
          activeToolLabel: TOOL_LABELS[event.tool]
        }));
        break;

      case 'tool_result':
        this.applyToolResult(event.activity);
        break;

      case 'error':
        this.patchLastAssistantMessage((m) => ({
          ...m,
          text: m.text || event.message,
          streaming: false,
          waiting: false,
          error: true
        }));
        break;

      case 'done':
        this.patchLastAssistantMessage((m) => ({ ...m, streaming: false, waiting: false, activeToolLabel: undefined }));
        break;
    }
  }

  private applyToolResult(activity: ToolActivity): void {
    if (activity.tool === 'search_products' || activity.tool === 'compare_products') {
      const result = activity.result as { products?: Product[] };
      if (result?.products) {
        this.patchLastAssistantMessage((m) => ({ ...m, products: result.products }));
      }
    }

    if (activity.tool === 'add_to_cart' || activity.tool === 'get_cart') {
      const result = activity.result as { cart?: { itemCount?: number }; itemCount?: number };
      const count = result?.cart?.itemCount ?? result?.itemCount;
      if (typeof count === 'number') this.cartItemCount.set(count);
    }
  }

  private patchLastAssistantMessage(patch: (m: ChatMessage) => ChatMessage): void {
    this.messages.update((all) => {
      const next = [...all];
      const lastIndex = next.length - 1;
      if (lastIndex >= 0 && next[lastIndex].role === 'assistant') {
        next[lastIndex] = patch(next[lastIndex]);
      }
      return next;
    });
  }
}