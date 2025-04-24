import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { SubCategory } from '../../models/subCategory.model';

import { ProductService } from '../../services/crudproducts.service';
import { CategoryService } from '../../services/category.service';
import { SubCategoryService } from '../../services/subCategory.service';

import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-product-form',
  imports: [CommonModule, FormsModule, RouterModule, CardComponent],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnInit {
  product: Product = {
    name: "",
    description: "",
    price: 0,
    categoryId: "",
    subCategoryId: "",
    imageUrl: "",
  }

  categories: Category[] = []
  subcategories: SubCategory[] = []
  filteredSubcategories: SubCategory[] = []

  isLoading = false
  isEdit = false
  formSubmitted = false
  

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private subcategoryService: SubCategoryService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.loadCategories()
    this.loadSubcategories()

    const productId = this.route.snapshot.paramMap.get("id")
    if (productId) {
      this.isEdit = true
      this.loadProduct(productId)
    }
  }

  loadProduct(productId: string) {

    this.isLoading = true

    this.productService.getProductById(productId).subscribe({
      next: (productResult) => {
        this.product = productResult!
        this.filterSubcategories()
        this.isLoading = false
      },
      error: (error) => {
        console.error("Error loading product", error)
        this.isLoading = false
      },
    })

  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories
      },
      error: (error) => {
        console.error("Error loading categories", error)
      },
    })
  }

  loadSubcategories() {
    this.subcategoryService.getAllSubCategories().subscribe({
      next: (subcategories) => {
        this.subcategories = subcategories
        this.filterSubcategories()
      },
      error: (error) => {
        console.error("Error loading subcategories", error)
      },
    })
  }

  filterSubcategories() {
    if (!this.product.categoryId) {
      this.filteredSubcategories = []
      return
    }

    this.filteredSubcategories = this.subcategories.filter(
      (subcategory) => subcategory.parentCategoryId === this.product.categoryId,
    )

    //reset subcategory if it doesn't belong to the selected category
    const isValidSubcategory = this.filteredSubcategories.some(
      (subcategory) => subcategory.subCategoryId === this.product.subCategoryId,
    )

    if (!isValidSubcategory) {
      this.product.subCategoryId = ""
    }
  }

  onCategoryChange() {
    this.filterSubcategories()
  }

  onSubmit() {
    this.formSubmitted = true

    if (
      !this.product.name ||
      !this.product.description ||
      this.product.price <= 0 ||
      !this.product.categoryId ||
      !this.product.subCategoryId ||
      !this.product.imageUrl
    ) {
      return
    }

    this.isLoading = true

    if (this.isEdit && this.product.productId) {
      this.productService.updateProduct(this.product.productId, this.product).subscribe({
        next: () => {
          this.router.navigate(["/admin/products"])
        },
        error: (error) => {
          console.error("Error updating product", error)
          this.isLoading = false
        },
      })
    } else {
      this.productService.addProduct(this.product).subscribe({
        next: () => {
          this.router.navigate(["/admin/products"])
        },
        error: (error) => {
          console.error("Error adding product", error)
          this.isLoading = false
        },
      })
    }
  }
}
