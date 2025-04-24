import { Component, OnInit, ViewChild } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormsModule } from "@angular/forms"
import { MatTableModule, MatTableDataSource } from "@angular/material/table"
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator"
import { MatSort, MatSortModule } from "@angular/material/sort"
import { MatInputModule } from "@angular/material/input"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatDialog, MatDialogModule } from "@angular/material/dialog"
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"
import { MatIconModule } from "@angular/material/icon"

import { Product } from "../../models/product.model"

import { ProductService } from "../../services/crudproducts.service"

import { ConfirmDialogComponent } from "../confirm-dialog/confirm-dialog.component"


@Component({
  selector: "app-product-list",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.css"],
})
export class ProductListComponent implements OnInit {
  displayedColumns: string[] = ["image", "name", "price", "category", "actions"]
  dataSource = new MatTableDataSource<Product>([])
  isLoading = true
  searchTerm = ""

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort

  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.loadProducts()
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
  }

  loadProducts() {
    this.isLoading = true
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.dataSource.data = products
        this.isLoading = false
      },
      error: (error) => {
        console.error("Error loading products", error)
        this.snackBar.open("Error loading products", "Close", { duration: 3000 })
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

  confirmDelete(product: Product) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "350px",
      data: {
        title: "Confirm Delete",
        message: `Are you sure you want to delete the product "${product.name}"? This action cannot be undone.`,
      },
    })

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.deleteProduct(product)
      }
    })
  }

  deleteProduct(product: Product) {
    if (!product || !product.productId) return

    this.productService.deleteProduct(product.productId).subscribe({
      next: () => {
        this.loadProducts()
        this.snackBar.open("Product deleted successfully", "Close", { duration: 3000 })
      },
      error: (error) => {
        console.error("Error deleting product", error)
        this.snackBar.open("Error deleting product", "Close", { duration: 3000 })
      },
    })
  }
}
