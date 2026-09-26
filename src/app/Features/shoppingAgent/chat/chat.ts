import { Component, ElementRef, ViewChild } from '@angular/core';
import { Product } from '../model/agent.model';
import { ChatService } from '../../../Core/services/chat-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShoppingAgentBubble } from '../shopping-agent-bubble/shopping-agent';
import { AddToCartEvent } from '../../../Shared/product-card/product-card';
import { AuthService } from '../../auth/services/auth-service';

@Component({
  selector: 'app-chat',
  imports: [CommonModule,ShoppingAgentBubble,FormsModule],
  standalone: true,
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat {

  @ViewChild('scrollAnchor') private scrollAnchor!: ElementRef<HTMLDivElement>;

  draft = '';
  isOpen = false;

  
  constructor(readonly chat: ChatService, private api: AuthService) {
  }



  ngAfterViewChecked(): void {
    this.scrollAnchor?.nativeElement?.scrollIntoView({ behavior: 'smooth' });
  }

  toggle(): void {
    this.isOpen = !this.isOpen;
    
  }

  async submit(): Promise<void> {
    const text = this.draft.trim();
    if (!text || this.chat.isStreaming()) return;

    this.draft = '';
    await this.chat.sendMessage(text);
  }

  stop(): void {
    this.chat.stopStreaming();
  }

  onAddToCart(event: AddToCartEvent): void {
    console.log('Add to cart event received:', event);
    if (this.chat.isStreaming()) return;
    // Include the real id explicitly — clicking a card should never require
    // the model to re-guess or re-resolve which product was meant.
    this.chat.sendMessage(`Add "${event.title}" (id: ${event.id}) to my cart.`);
  }


}
