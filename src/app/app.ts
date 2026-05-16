import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { NotificationToastComponent } from './layout/notification-toast/notification-toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, NotificationToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
