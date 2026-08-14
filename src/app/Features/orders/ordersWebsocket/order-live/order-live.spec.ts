import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderLive } from './order-live';

describe('OrderLive', () => {
  let component: OrderLive;
  let fixture: ComponentFixture<OrderLive>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderLive]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderLive);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
