import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

  import { ProductCard } from '../../../Shared/product-card/product-card';
import { ChatMessage } from '../model/agent.model';
import {  AddToCartEvent } from '../../../Shared/product-card/product-card';
 
@Component({
  selector: 'app-shopping-agent-bubble',
  imports: [CommonModule,ProductCard],
  standalone: true,
  templateUrl: './shopping-agent.html',
  styleUrl: './shopping-agent.css',
})

export class ShoppingAgentBubble {


  @Input({ required: true }) message!: ChatMessage;
  @Output() addToCart = new EventEmitter<AddToCartEvent>();
  

}
