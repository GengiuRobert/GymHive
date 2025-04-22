import { Component, Input } from "@angular/core"
import { CommonModule } from "@angular/common"

import { ShoppingCart } from "../../models/shopping-cart.model"

@Component({
  selector: 'app-order-summary',
  imports: [CommonModule],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.css'
})
export class OrderSummaryComponent {
  @Input() cart!: ShoppingCart

  shippingCost = 24.99

  taxRate = 0.18

  get subtotal(): number {
    if (!this.cart?.products || this.cart.products.length === 0) {
      return 0
    }

    return this.cart.products.reduce((total, product) => {
      return total + (product.price || 0) * (product.quantity || 1)
    }, 0)
  }

  get tax(): number {
    return this.subtotal * this.taxRate
  }

  get total(): number {
    return this.subtotal + this.tax + this.shippingCost
  }

}
