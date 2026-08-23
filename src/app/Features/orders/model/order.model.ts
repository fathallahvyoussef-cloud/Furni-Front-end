export type OrderStatusType = 'Pending' | 'Order Placed' |'Processing' | 'In Transit' | 'Delivered';

export type PaymentStatusType = 'Pending' | 'Paid' | 'Failed';

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  date: string;
  adress: string;
  phone: string;
  status: OrderStatusType;
  paymentStatus: PaymentStatusType;
  stripePaymentIntentId: string;
}