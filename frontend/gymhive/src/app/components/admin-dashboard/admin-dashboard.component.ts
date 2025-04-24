import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CardComponent } from '../card/card.component';
import { ProductService } from '../../services/crudproducts.service';
import { CategoryService } from '../../services/category.service';
import { EmailService } from '../../services/email.service';
import { UserProfileService } from '../../services/profile.service';
import { forkJoin } from 'rxjs';
import { EmailOrderRequest } from '../../models/email-request.model';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, RouterModule, CardComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {

  stats = {
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    activeUsers: 0,
  }

  recentOrders: any[] = []
  isLoading = true

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private emailService: EmailService,
    private userProfileService: UserProfileService,
  ) { }

  ngOnInit() {
    this.loadDashboardData()
  }

  loadDashboardData() {
    this.isLoading = true

    forkJoin({
      products: this.productService.getAllProducts(),
      categories: this.categoryService.getAllCategories(),
      orders: this.emailService.getAllExistingOrders(),
      users: this.userProfileService.getAllProfiles(),
    }).subscribe({
      next: (results) => {

        this.stats = {
          totalProducts: results.products.length,
          totalCategories: results.categories.length,
          totalOrders: results.orders.length,
          activeUsers: results.users.length,
        }

        this.processRecentOrders(results.orders)
        this.isLoading = false
      },
      error: (error) => {
        console.error("Error loading dashboard data:", error)
        this.isLoading = false
      },
    })
  }

  processRecentOrders(orders: EmailOrderRequest[]) {

    const sortedOrders = [...orders].sort((a, b) => {
      const dateA = new Date(a.orderDate as string).getTime()
      const dateB = new Date(b.orderDate as string).getTime()
      return dateB - dateA
    })

    const recentOrders = sortedOrders.slice(0, 5)

    this.recentOrders = recentOrders.map((order) => {
      const subtotal = order.items.reduce((sum, item) => {
        return sum + item.product.price * item.quantity
      }, 0)

      const total = subtotal + order.shippingCost + order.tax

      let formattedDate
      try {
        const date = new Date(order.orderDate as string)
        formattedDate = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      } catch (e) {
        formattedDate = order.orderDate
      }

      const statuses = ["Delivered", "Processing", "Shipped"]
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]

      return {
        id: order.orderID,
        customer: order.customerName,
        date: formattedDate,
        total: total,
        status: randomStatus,
      }
    })
  }

}
