import { Component, Inject, Optional } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatDividerModule } from "@angular/material/divider"
import { EmailOrderRequest } from "../../models/email-request.model"
import { ActivatedRoute, Router } from "@angular/router"

@Component({
  selector: "app-order-details",
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatDividerModule],
  templateUrl: "./order-details.component.html",
  styleUrls: ["./order-details.component.css"],
})
export class OrderDetailsComponent {
  subtotal = 0
  total = 0
  isDialog = false
  order: EmailOrderRequest;

  constructor(
    @Optional() public dialogRef: MatDialogRef<OrderDetailsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { order: EmailOrderRequest },
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Check if we're in a dialog
    this.isDialog = !!this.dialogRef;
    
    if (this.isDialog) {
      this.order = this.data.order;
    } else {
      // If not in dialog, initialize with empty order
      this.order = {} as EmailOrderRequest;
      
      // Here you would load the order data based on route params
      const orderId = this.route.snapshot.paramMap.get("id");
      if (orderId) {
        // this.loadOrder(orderId);
        
        // For now, mock some data
        this.order = {
          orderID: orderId,
          customerName: "John Doe",
          customerEmail: "john@example.com",
          orderDate: new Date().toISOString(),
          items: [
            { product: { name: "Product 1", price: 29.99 }, quantity: 2 },
            { product: { name: "Product 2", price: 49.99 }, quantity: 1 }
          ],
          shippingCost: 5.99,
          tax: 8.5,
          address: {
            street: "123 Main St",
            city: "New York",
            state: "NY",
            zipCode: "10001",
            country: "USA"
          }
        } as unknown as EmailOrderRequest;
      }
    }
    
    this.calculateTotals();
  }

  calculateTotals(): void {
    if (this.order && this.order.items) {
      this.subtotal = this.order.items.reduce((sum, item) => {
        return sum + item.product.price * item.quantity
      }, 0)

      this.total = this.subtotal + (this.order.shippingCost || 0) + (this.order.tax || 0)
    }
  }

  onClose(): void {
    if (this.isDialog) {
      this.dialogRef.close()
    } else {
      this.router.navigate(["/admin/orders"])
    }
  }
}
