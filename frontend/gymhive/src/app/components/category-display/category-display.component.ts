import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ActivatedRoute, RouterModule } from "@angular/router"
import { catchError, finalize, forkJoin, of, switchMap } from "rxjs"

import { CategorySidebarComponent } from "../category-sidebar/category-sidebar.component"
import { ProductDetailsModalComponent } from "../product-details-modal/product-details-modal.component"
import { LoadingSpinnerComponent } from "../loading-spinner/loading-spinner.component"

import { Product } from "../../models/product.model"
import { Category } from "../../models/category.model"
import { SubCategory } from "../../models/subCategory.model"

import { ProductService } from "../../services/crudproducts.service"
import { CategoryService } from "../../services/category.service"
import { SubCategoryService } from "../../services/subCategory.service"
import { SpinnerService } from "../../services/spinner.service"


@Component({
  selector: "app-category-display",
  standalone: true,
  imports: [CommonModule, RouterModule, CategorySidebarComponent, ProductDetailsModalComponent, LoadingSpinnerComponent],
  templateUrl: "./category-display.component.html",
  styleUrls: ["./category-display.component.css"],
})
export class CategoryDisplayComponent {
  categoryType = ""
  subcategory: string | null = null
  categoryTitle = ""
  currentCategory: Category | undefined
  currentSubCategory: SubCategory | undefined
  currentSubCategories: SubCategory[] = []
  products: Product[] = []
  productsCopy: Product[] = []
  selectedProduct: Product | null = null
  isModalOpen = false
  selectedPriceFilters: string[] = [];

  constructor(private route: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private spinnerService: SpinnerService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.subcategory = params.get("subcategory")
      this.loadData()
    })

    this.route.data.subscribe((data) => {
      this.categoryType = data["categoryType"] || ""
      this.setCategoryTitle()
      this.loadData()
    })
  }

  private loadData(): void {

    if (!this.categoryType) return

    this.spinnerService.showSpinner()

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
        finalize(() => this.spinnerService.hideSpinner())
      )
      .subscribe((products) => {
        this.filterAndDisplayProducts(products)
      })

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

    this.productsCopy = this.products
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

  onPriceFiltersChanged(filters: string[]): void {
    this.selectedPriceFilters = filters;
    this.applyFilters();
  }

  private applyFilters(): void {
    if (!this.selectedPriceFilters || this.selectedPriceFilters.length === 0) {
      this.products = this.productsCopy
      return;
    }
    else {
      this.products = this.productsCopy
        .filter(product => this.selectedPriceFilters
        .some(filter => this.inPriceRange(product.price, filter)))
    }
  }

  inPriceRange(price: number, filter: string): boolean {
    switch (filter) {
      case "under25":
        return price < 25;
      case "25to50":
        return price >= 25 && price <= 50;
      case "50to100":
        return price > 50 && price <= 100;
      case "over100":
        return price > 100;
      default:
        return true;
    }
  }

  private setCategoryTitle(): void {
    const formattedCategoryType = this.categoryType.charAt(0).toUpperCase() + this.categoryType.slice(1)

    if (this.subcategory) {
      const formattedSubcategory = this.subcategory.charAt(0).toUpperCase() + this.subcategory.slice(1)
      this.categoryTitle = `${formattedSubcategory} ${formattedCategoryType}`
    } else {
      this.categoryTitle = formattedCategoryType
    }
  }

  openProductDetails(product: Product): void {
    this.selectedProduct = product
    this.isModalOpen = true
  }

  closeModal(): void {
    this.isModalOpen = false
  }

}

