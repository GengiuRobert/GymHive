import { Component, Inject, OnInit, Optional } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from "@angular/material/button"
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"
import { Category } from "../../models/category.model"
import { ActivatedRoute, Router } from "@angular/router"
import { CategoryService } from "../../services/category.service"

@Component({
  selector: "app-category-form",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: "./category-form.component.html",
  styleUrls: ["./category-form.component.css"],
})
export class CategoryFormComponent implements OnInit {
  categoryForm!: FormGroup
  isLoading = false
  isEdit = false
  isDialog = false;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    @Optional() public dialogRef: MatDialogRef<CategoryFormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { category: Category },
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
  ) {
    this.isDialog = !!this.dialogRef;

    if (!this.isDialog) {
      this.data = { category: {} as Category };
    }
  }

  ngOnInit(): void {
    if (!this.isDialog) {
      const categoryId = this.route.snapshot.paramMap.get("id")
      if (categoryId) {
        this.isEdit = true
      }
    } else {
      this.isEdit = !!this.data.category.categoryId
    }

    this.initForm()
  }

  initForm(): void {
    this.categoryForm = this.fb.group({
      categoryName: [this.data.category.categoryName || "", [Validators.required]],
    })
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) return

    this.isLoading = true

    const categoryData: Category = {
      ...this.data.category,
      ...this.categoryForm.value,
    }

    const call$ = this.isEdit
      ? this.categoryService.updateCategoryById(categoryData.categoryId!, categoryData)
      : this.categoryService.addCategory(categoryData)

    call$.subscribe({
      next: () => {

        const action = this.isEdit ? 'updated' : 'added'

        this.snackBar.open(`Category ${action} successfully`, 'Close', { duration: 3000 })

        if (this.isDialog) {
          this.dialogRef!.close(true)
        } else {
          this.router.navigate(['/admin/categories'])
        }
        this.isLoading = false

      },
      error: (err) => {
        console.error('Save failed', err)
        this.snackBar.open('Error saving category', 'Close', { duration: 3000 })
        this.isLoading = false
      },
    })
  }

  onCancel(): void {
    if (this.isDialog) {
      this.dialogRef.close()
    } else {
      this.router.navigate(["/admin/categories"])
    }
  }
}
