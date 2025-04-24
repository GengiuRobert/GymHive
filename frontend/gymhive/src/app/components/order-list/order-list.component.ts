import { Component, type OnInit, ViewChild } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatTableModule, MatTableDataSource } from "@angular/material/table"
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator"
import { MatSort, MatSortModule } from "@angular/material/sort"
import { MatInputModule } from "@angular/material/input"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatDialog, MatDialogModule } from "@angular/material/dialog"
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"
import { EmailService } from "../../services/email.service"
import { EmailOrderRequest } from "../../models/email-request.model"
import { OrderDetailsComponent } from "../order-details/order-details.component"

@Component({
  selector: "app-order-list",
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: "./order-list.component.html",
  styleUrls: ["./order-list.component.css"],
})

export class OrderListComponent implements OnInit {
  displayedColumns: string[] = ["orderID", "customerName", "orderDate", "total", "actions"]
  dataSource = new MatTableDataSource<EmailOrderRequest>([])
  isLoading = true

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort

  constructor(
    private emailService: EmailService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.loadOrders()
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
  }

  loadOrders(): void {
    
    this.isLoading = true

    this.emailService.getAllExistingOrders().subscribe({
      next: (orders) => {
        
        const displayOrders = orders.map((order) => {
          const subtotal = order.items.reduce((sum, item) =>
            sum + item.product.price * item.quantity,
            0)
          const total = subtotal + order.shippingCost + order.tax
          return { ...order, total }
        })

        this.dataSource.data = displayOrders
        
        this.isLoading = false
      },
      error: (error) => {
        console.error("Error loading orders", error)
        this.snackBar.open("Error loading orders", "Close", { duration: 3000 })
        this.isLoading = false
      },
    })

  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage()
    }
  }

  viewOrderDetails(order: EmailOrderRequest): void {
    this.dialog.open(OrderDetailsComponent, {
      width: "800px",
      data: { order },
    })
  }
}
