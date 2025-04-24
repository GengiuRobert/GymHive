import { Component, Inject, OnInit, Optional } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatSelectModule } from "@angular/material/select"
import { MatButtonModule } from "@angular/material/button"
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"
import { SubCategory } from "../../models/subCategory.model"
import { Category } from "../../models/category.model"
import { ActivatedRoute, Router } from "@angular/router"
import { SubCategoryService } from "../../services/subCategory.service"
import { CategoryService } from "../../services/category.service"

@Component({
  selector: "app-subcategory-form",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: "./subcategory-form.component.html",
  styleUrls: ["./subcategory-form.component.css"],
})
export class SubcategoryFormComponent implements OnInit {
  subcategoryForm!: FormGroup
  isLoading = false
  isEdit = false
  isDialog = false
  categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    @Optional() public dialogRef: MatDialogRef<SubcategoryFormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: {
      subcategory: SubCategory,
      categories: Category[]
    },
    private route: ActivatedRoute,
    private router: Router,
    private subcategoryService: SubCategoryService,
    private categoryService: CategoryService
  ) {
    this.isDialog = !!this.dialogRef;

    if (!this.isDialog) {
      this.data = {
        subcategory: {} as SubCategory,
        categories: []
      };

    }
  }

  ngOnInit(): void {
    if (!this.isDialog) {
      const subcategoryId = this.route.snapshot.paramMap.get("id")

      if (subcategoryId) {
        this.isEdit = true
      }

      this.categoryService.getAllCategories().subscribe({
        next: (allCategories) => {
          this.categories = allCategories
        },
        error: (err) => {
          console.error('getting all categories failed', err)

        },
      })

      console.log(this.categories)

    } else {
      this.isEdit = !!this.data.subcategory.subCategoryId
      this.categories = []
    }

    this.initForm()
  }

  initForm(): void {
    this.subcategoryForm = this.fb.group({
      subCategoryName: [this.data.subcategory.subCategoryName || "", [Validators.required]],
      parentCategoryId: [this.data.subcategory.parentCategoryId || "", [Validators.required]],
    })
  }

  onSubmit(): void {
    if (this.subcategoryForm.invalid) return

    this.isLoading = true

    const subcategoryData: SubCategory = {
      ...this.data.subcategory,
      ...this.subcategoryForm.value,
    }

    const call$ = this.isEdit
      ? this.subcategoryService.updateSubCategoryById(subcategoryData.subCategoryId!, subcategoryData)
      : this.subcategoryService.addSubCategory(subcategoryData)

    call$.subscribe({
      next: () => {

        const action = this.isEdit ? 'updated' : 'added'

        this.snackBar.open(`Subcategory ${action} successfully`, 'Close', { duration: 3000 })

        if (this.isDialog) {
          this.dialogRef!.close(true)
        } else {
          this.router.navigate(['/admin/subcategories'])
        }

        this.isLoading = false

      },
      error: (err) => {
        console.error('Save failed', err)
        this.snackBar.open('Error saving subcategory', 'Close', { duration: 3000 })
        this.isLoading = false
      },
    })
  }

  onCancel(): void {
    if (this.isDialog) {
      this.dialogRef.close()
    } else {
      this.router.navigate(["/admin/subcategories"])
    }
  }
}
