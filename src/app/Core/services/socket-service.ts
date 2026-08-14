import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import {Order} from '../../Features/orders/model/order.model';




@Injectable({
  providedIn: 'root',
})
export class SocketService {

  private socket: Socket; 
  
    constructor() {
      this.socket = io('http://localhost:5000'); // Replace with your actual WebSocket server URL
    }
  
    trackOrder(orderId: string) {
      this.socket.emit('trackOrder', orderId);
    }
  
    onOrderStatusUpdate(): Observable<Order> {
      return new Observable(observer => {
        const handler = (data: Order) => observer.next(data);
        this.socket.on('orderStatusUpdate', handler);
        return () => this.socket.off('orderStatusUpdate', handler);
      });
    }
  
}
