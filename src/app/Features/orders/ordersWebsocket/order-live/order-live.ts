import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Order, OrderStatusType } from '../../model/order.model';
import { Subscription } from 'rxjs';
import { ApiCalls } from '../../../../Core/services/api-calls';
import { CommonModule } from '@angular/common';
import { SocketService } from '../../../../Core/services/socket-service';
import { ActivatedRoute } from '@angular/router';



interface StepDefinition {
  statusKey: OrderStatusType;
  title: string;
  icon: string;
}

@Component({
  selector: 'app-order-live',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './order-live.html',
  styleUrl: './order-live.css',
})


export class OrderLive {


 url : string = "https://furni-back-end.onrender.com/orders"
//  'http://localhost:5000/orders'; 

   isLoading = true;
  currentOrder: Order | null = null;


  public steps: StepDefinition[] = [
    { statusKey: 'Pending', title: 'Pending', icon: '⌛' },
    { statusKey: 'Order Placed', title: 'Order Placed', icon: '🛒' },
    { statusKey: 'Processing', title: 'Processing', icon: '📦' },
    { statusKey: 'In Transit', title: 'In Transit', icon: '🚚' },
    { statusKey: 'Delivered', title: 'Delivered', icon: '🏡' }
  ];

    private statusSub!: Subscription;


  constructor(
        private route: ActivatedRoute,
    private api: ApiCalls,
    private socketService: SocketService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
if (id) {
  console.log('Fetching order with ID:', id);
       //  Initial load via HTTP
      this.api.getById<Order>(this.url,id).subscribe({
        next: (order) => {
          this.currentOrder = order;
          this.isLoading = false;
          
          // Join the socket room for this order AFTER we know it exists
          this.socketService.trackOrder(order._id);

              this.cdr.detectChanges();

        },
        error: (err) => {
          console.error('Failed to load order', err);
          this.isLoading = false;

          this.cdr.detectChanges();

        }
      });
  
      //  Listen for live updates
      this.statusSub = this.socketService.onOrderStatusUpdate().subscribe(updatedOrder => {
        if (updatedOrder._id === id) {
          console.log('Received live update for order:', updatedOrder);
           this.currentOrder = updatedOrder;
          this.cdr.detectChanges();
        }
      });
  
}

  }

 
  get currentStepIndex(): number {

    if (!this.currentOrder?.status) return 0;
    const index = this.steps.findIndex(step => step.statusKey === this.currentOrder?.status);
  return index === -1 ? 0 : index;  
}

  get progressWidth(): number {
    if (this.currentStepIndex <= 0) return 0;
    return (this.currentStepIndex / (this.steps.length - 1)) * 100;
  }

  ngOnDestroy(): void {
    this.statusSub?.unsubscribe();
  }

}
