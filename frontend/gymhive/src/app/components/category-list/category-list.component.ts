import { Component, OnInit, ViewChild } from "@angular/core"
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
import { CategoryService } from "../../services/category.service"
import { Category } from "../../models/category.model"
import { CategoryFormComponent } from "../category-form/category-form.component"
import { ConfirmDialogComponent } from "../confirm-dialog/confirm-dialog.component"

@Component({
  selector: "app-category-list",
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
  templateUrl: "./category-list.component.html",
  styleUrls: ["./category-list.component.css"],
})
export class CategoryListComponent implements OnInit {
  displayedColumns: string[] = ["categoryId", "categoryName", "actions"]
  dataSource = new MatTableDataSource<Category>([])
  isLoading = true

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.loadCategories()
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
  }

  loadCategories(): void {
    this.isLoading = true
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.dataSource.data = categories
        this.isLoading = false
      },
      error: (error) => {
        console.error("Error loading categories", error)
        this.snackBar.open("Error loading categories", "Close", { duration: 3000 })
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

  openCategoryForm(category?: Category): void {
    const dialogRef = this.dialog.open(CategoryFormComponent, {
      width: "500px",
      data: { category: category ? { ...category } : {} },
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadCategories()
      }
    })
  }

  deleteCategory(category: Category): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "350px",
      data: {
        title: "Confirm Delete",
        message: `Are you sure you want to delete the category "${category.categoryName}"?`,
      },
    })

    dialogRef.afterClosed().subscribe((confirmed) => {

      if (!confirmed) return

      this.categoryService.deleteCategoryById(category.categoryId!).subscribe({
        next: () => {
          this.snackBar.open("Category deleted successfully", "Close", { duration: 3000 })
          this.loadCategories()
        },
        error: (err) => {
          console.error("Delete failed", err)
          this.snackBar.open("Error deleting category", "Close", { duration: 3000 })
        },
      })

    })

  }

}
