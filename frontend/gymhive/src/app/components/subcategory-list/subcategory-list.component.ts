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
import { SubCategoryService } from "../../services/subCategory.service"
import { CategoryService } from "../../services/category.service"
import { SubCategory } from "../../models/subCategory.model"
import { Category } from "../../models/category.model"
import { SubcategoryFormComponent } from "../subcategory-form/subcategory-form.component"
import { ConfirmDialogComponent } from "../confirm-dialog/confirm-dialog.component"
import { forkJoin } from "rxjs"

@Component({
  selector: "app-subcategory-list",
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
  templateUrl: "./subcategory-list.component.html",
  styleUrls: ["./subcategory-list.component.css"],
})
export class SubcategoryListComponent implements OnInit {
  displayedColumns: string[] = ["subCategoryId", "subCategoryName", "parentCategory", "actions"]
  dataSource = new MatTableDataSource<any>([])
  isLoading = true
  categories: Category[] = []

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort

  constructor(
    private subcategoryService: SubCategoryService,
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.loadData()
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
  }

  loadData(): void {
    this.isLoading = true

    forkJoin({
      subcategories: this.subcategoryService.getAllSubCategories(),
      categories: this.categoryService.getAllCategories(),
    }).subscribe({
      next: ({ subcategories, categories }) => {
        this.categories = categories

        // Enhance subcategories with parent category name
        const enhancedSubcategories = subcategories.map((subcategory) => {
          const parentCategory = categories.find((cat) => cat.categoryId === subcategory.parentCategoryId)
          return {
            ...subcategory,
            parentCategoryName: parentCategory ? parentCategory.categoryName : "Unknown",
          }
        })

        this.dataSource.data = enhancedSubcategories
        this.isLoading = false
      },
      error: (error) => {
        console.error("Error loading data", error)
        this.snackBar.open("Error loading data", "Close", { duration: 3000 })
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

  openSubcategoryForm(subcategory?: SubCategory): void {
    const dialogRef = this.dialog.open(SubcategoryFormComponent, {
      width: "500px",
      data: {
        subcategory: subcategory ? { ...subcategory } : {},
        categories: this.categories,
      },
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadData()
      }
    })
  }

  deleteSubcategory(subcategory: SubCategory): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "350px",
      data: {
        title: "Confirm Delete",
        message: `Are you sure you want to delete the subcategory "${subcategory.subCategoryName}"?`,
      },
    })

    dialogRef.afterClosed().subscribe((confirmed) => {

      if (!confirmed) return

      this.subcategoryService.deleteSubCategoryById(subcategory.subCategoryId!).subscribe({
        next: () => {
          this.snackBar.open("Subcategory deleted successfully", "Close", { duration: 3000 })
          this.loadData()
        },
        error: (err) => {
          console.error("Delete failed", err)
          this.snackBar.open("Error deleting subcategory", "Close", { duration: 3000 })
        },
      })

    })
  }
}
