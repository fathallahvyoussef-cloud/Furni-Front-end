import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './Core/Layout/header/header';
import { Footer } from './Core/Layout/footer/footer';
import { Chat } from './Features/shoppingAgent/chat/chat';

@Component({
  selector: 'app-root',
  imports: [Chat,RouterOutlet,Header,Footer],
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('reusable');

 
}
