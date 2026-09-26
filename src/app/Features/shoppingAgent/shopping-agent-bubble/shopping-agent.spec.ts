import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingAgent } from './shopping-agent';

describe('ShoppingAgent', () => {
  let component: ShoppingAgent;
  let fixture: ComponentFixture<ShoppingAgent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShoppingAgent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShoppingAgent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
