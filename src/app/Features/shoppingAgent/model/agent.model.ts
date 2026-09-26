

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  role: ChatRole;
  text: string;
  /** Products surfaced by a search/compare tool call attached to this turn, if any */
  products?: Product[];
  /** True while tokens are still streaming in for this message */
  streaming?: boolean;
  /** True only in the brief window before the first token/tool event arrives */
  waiting?: boolean;
  /** Human-readable label for whichever tool is currently running, e.g. "Searching products…" */
  activeToolLabel?: string;
  error?: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image : string;
  currency?: string;
  rating?: number;
  reviewCount?: number;
  tags?: string[];
  inStock: boolean;
  variants?: { sku: string; label: string; inStock: boolean }[];
}

export type ToolName =
  | 'search_products'
  | 'get_product_details'
  | 'compare_products'
  | 'add_to_cart'
  | 'get_cart';

export interface ToolActivity {
  tool: ToolName;
  input: Record<string, unknown>;
  result: unknown;
}


export type ChatStreamEvent =
  | { type: 'text_delta'; text: string }
  | { type: 'tool_start'; tool: ToolName }
  | { type: 'tool_result'; activity: ToolActivity }
  | { type: 'done' }
  | { type: 'error'; message: string };

export const TOOL_LABELS: Record<ToolName, string> = {
  search_products: 'Searching products…',
  get_product_details: 'Checking product details…',
  compare_products: 'Comparing options…',
  add_to_cart: 'Updating your cart…',
  get_cart: 'Checking your cart…'
};
