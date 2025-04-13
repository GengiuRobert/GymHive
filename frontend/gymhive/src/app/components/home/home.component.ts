import { Component, inject, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { finalize, forkJoin } from "rxjs";

import { Product } from "../../models/product.model"

import { ProductDetailsModalComponent } from "../product-details-modal/product-details-modal.component";
import { LoadingSpinnerComponent } from "../loading-spinner/loading-spinner.component";

import { ProductService } from "../../services/crudproducts.service";
import { CategoryService } from "../../services/category.service";
import { SubCategoryService } from "../../services/subCategory.service";
import { SpinnerService } from "../../services/spinner.service";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, RouterModule, ProductDetailsModalComponent, LoadingSpinnerComponent],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {

  selectedProduct: Product | null = null
  isModalOpen = false

  featuredProducts: Product[] = []

  categories = [
    { name: "Equipment", link: "/category/equipment" },
    { name: "Supplements", link: "/category/supplements" },
    { name: "Apparel", link: "/category/apparel" },
    { name: "Nutrition", link: "/category/nutrition" },
  ]

  private productsService = inject(ProductService)
  private categoryService = inject(CategoryService)
  private subCategoryService = inject(SubCategoryService)
  private spinnerService = inject(SpinnerService)

  ngOnInit(): void {
    this.spinnerService.showSpinner()
    this.loadData()
  }

  loadData() {
    this.productsService.getTwoRandomProducts().subscribe((randomProds) => {

      const imageUrlOperations = randomProds.map((product) => {
        return forkJoin({
          categoryName: this.categoryService.getCategoryNameByCategoryId(product.categoryId),
          subCategoryName: this.subCategoryService.getSubCategoryNameByCategoryId(product.subCategoryId),
          product: Promise.resolve(product),
        })
      })


      forkJoin(imageUrlOperations).subscribe((results) => {
        this.featuredProducts = results.map((result) => {
          const catName = result.categoryName.toLowerCase().replace(/\s+/g, "_")
          const subCatName = result.subCategoryName.toLowerCase().replace(/\s+/g, "_")
          const imagePath = `assets/${catName}/${subCatName}/${result.product.imageUrl}`

          return {
            ...result.product,
            imageUrl: imagePath,
          }
        })
      })
    })
  }

  openProductDetails(product: Product) {
    this.selectedProduct = product
    this.isModalOpen = true
  }

  closeModal(): void {
    this.isModalOpen = false
  }

}