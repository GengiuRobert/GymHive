import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ActivatedRoute, RouterModule } from "@angular/router"
import { catchError, forkJoin, of, switchMap } from "rxjs"

import { CategorySidebarComponent } from "../category-sidebar/category-sidebar.component"
import { ProductDetailsModalComponent } from "../product-details-modal/product-details-modal.component"

import { Product } from "../../models/product.model"
import { Category } from "../../models/category.model"
import { SubCategory } from "../../models/subCategory.model"

import { ProductService } from "../../services/crudproducts.service"
import { CategoryService } from "../../services/category.service"
import { SubCategoryService } from "../../services/subCategory.service"

@Component({
  selector: "app-category-display",
  standalone: true,
  imports: [CommonModule, RouterModule, CategorySidebarComponent, ProductDetailsModalComponent],
  templateUrl: "./category-display.component.html",
  styleUrls: ["./category-display.component.css"],
})
export class CategoryDisplayComponent {
  categoryType = ""
  subcategory: string | null = null
  featured: string | null = null
  categoryTitle = ""
  featuredTitle = ""
  currentCategory: Category | undefined
  currentSubCategory: SubCategory | undefined
  currentSubCategories: SubCategory[] = []
  products: Product[] = []
  selectedProduct: Product | null = null
  isModalOpen = false

  constructor(private route: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.subcategory = params.get("subcategory")
      this.loadData()
    })

    this.route.data.subscribe((data) => {
      this.categoryType = data["categoryType"] || ""
      this.featured = data["featured"] || null
      this.setCategoryTitle()
      this.loadData()
    })
  }

  private loadData(): void {
    if (!this.categoryType) return

    forkJoin({
      categories: this.categoryService.getAllCategories(),
      subcategories: this.subCategoryService.getAllSubCategories(),
    })
      .pipe(
        catchError((err) => {
          console.error("Error loading categories:", err)
          return of({ categories: [], subcategories: [] })
        }),
        switchMap(({ categories, subcategories }) => {

          this.currentCategory = categories.find(
            (c) => c.categoryName.toLowerCase() === this.categoryType.toLowerCase(),
          )

          if (this.currentCategory) {
            this.currentSubCategories = subcategories.filter(
              (sc) => sc.parentCategoryId === this.currentCategory?.categoryId,
            )
          }

          return this.productService.getAllProducts().pipe(
            catchError((err) => {
              console.error("Error loading products:", err)
              return of([])
            }),
          )
        }),
      )
      .subscribe((products) => {
        this.filterAndDisplayProducts(products)
      })
  }

  openProductDetails(product: Product): void {
    this.selectedProduct = product
    this.isModalOpen = true
  }

  closeModal(): void {
    this.isModalOpen = false
  }

  private filterAndDisplayProducts(allProducts: Product[]): void {

    let filteredProducts = allProducts

    if (this.currentCategory) {
      filteredProducts = filteredProducts.filter((p) => p.categoryId === this.currentCategory?.categoryId)

      if (this.subcategory && this.currentSubCategories.length > 0) {
        const subCategory = this.currentSubCategories.find(
          (sc) => sc.subCategoryName.toLowerCase() === this.subcategory?.toLowerCase(),
        )

        if (subCategory) {
          filteredProducts = filteredProducts.filter((p) => p.subCategoryId === subCategory.subCategoryId)
        }
      }
    }

    this.products = filteredProducts.map((product) => ({
      ...product,
      imageUrl: this.buildImageUrl(product, product.imageUrl),
    }))
  }

  private buildImageUrl(product: Product, imgUrl: string): string {
    const catName = this.currentCategory?.categoryName.toLowerCase()

    let imagePath = ''

    if (this.subcategory) {
      const subCatName = this.subcategory.toLowerCase().replace(/\s+/g, "_")
      imagePath = `assets/${catName}/${subCatName}/${imgUrl}`
    }

    const subCategory = this.currentSubCategories.find((sc) => sc.subCategoryId === product.subCategoryId)

    if (subCategory) {
      const subCatName = subCategory.subCategoryName.toLowerCase().replace(/\s+/g, "_")
      imagePath = `assets/${catName}/${subCatName}/${imgUrl}`
    }

    return imagePath

  }

  private setCategoryTitle(): void {
    const formattedCategoryType = this.categoryType.charAt(0).toUpperCase() + this.categoryType.slice(1)

    if (this.subcategory) {
      const formattedSubcategory = this.subcategory.charAt(0).toUpperCase() + this.subcategory.slice(1)
      this.categoryTitle = `${formattedSubcategory} ${formattedCategoryType}`
    } else if (this.featured) {
      switch (this.featured) {
        case "new":
          this.featuredTitle = "New Arrivals"
          this.categoryTitle = `New ${formattedCategoryType}`
          break
        case "best-sellers":
          this.featuredTitle = "Best Sellers"
          this.categoryTitle = `Best Selling ${formattedCategoryType}`
          break
        case "top-rated":
          this.featuredTitle = "Top Rated Products"
          this.categoryTitle = `Top Rated ${formattedCategoryType}`
          break
        case "essentials":
          this.featuredTitle = "Workout Essentials"
          this.categoryTitle = `${formattedCategoryType} Essentials`
          break
        case "meal-prep":
          this.featuredTitle = "Meal Prep Solutions"
          this.categoryTitle = `Meal Prep ${formattedCategoryType}`
          break
        case "snacks":
          this.featuredTitle = "Healthy Snacks"
          this.categoryTitle = `Healthy ${formattedCategoryType} Snacks`
          break
        default:
          this.categoryTitle = formattedCategoryType
      }
    } else {
      this.categoryTitle = formattedCategoryType
    }
  }

}

