import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

import { WebSocketService } from '../../services/websocket.service';

import { PriceChangeNotification } from '../../models/pricechange-notification.model';

@Component({
  selector: 'app-websocket-notification',
  imports: [CommonModule],
  templateUrl: './websocket-notification.component.html',
  styleUrl: './websocket-notification.component.css'
})
export class WebsocketNotificationComponent implements OnInit, OnDestroy {

  private subscription: Subscription | null = null;
  notifications: any[] = [];
  unreadCount = 0;
  showNotifications = false;

  constructor(
    private webSocketService: WebSocketService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.subscription = this.webSocketService.notifications$.subscribe((notification) => {

      if (notification) {

        if (notification.type === "PRICE_CHANGE") {

         // if (!this.isDuplicateNotification(notification)) {

            this.notifications.unshift(notification)
            this.unreadCount++


            this.snackBar
              .open(
                `Price drop! ${notification.productName} is now $${notification.newPrice.toFixed(2)} (${notification.discountPercentage}% off)`,
                "View",
                { duration: 5000 },
              )

          // } else {
          //   console.log("Duplicate notification detected and ignored:", notification)
          // }

        }

      }
      
    })
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.unreadCount = 0;
    }
  }

  clearNotifications(): void {
    this.notifications = [];
    this.unreadCount = 0;
  }

  // private isDuplicateNotification(notification: PriceChangeNotification): boolean {
  //   return this.notifications.some(
  //     (existingNotification) =>
  //       existingNotification.productId === notification.productId &&
  //       existingNotification.type === notification.type &&
  //       existingNotification.newPrice === notification.newPrice &&
  //       // Consider notifications within 5 seconds as duplicates
  //       Math.abs(existingNotification.timestamp - notification.timestamp) < 5000,
  //   )
  // }
}
