import { Component, OnDestroy, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ActivatedRoute, RouterModule } from "@angular/router"
import { catchError, finalize, forkJoin, of, Subscription, switchMap } from "rxjs"

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
import { UserService } from "../../services/user.service"
import { ShoppingCartService } from "../../services/shopping-cart.service"

@Component({
  selector: "app-category-display",
  standalone: true,
  imports: [CommonModule, RouterModule, CategorySidebarComponent, ProductDetailsModalComponent, LoadingSpinnerComponent],
  templateUrl: "./category-display.component.html",
  styleUrls: ["./category-display.component.css"],
})

export class CategoryDisplayComponent implements OnInit, OnDestroy {

  categoryType = ""
  categoryTitle = ""

  subcategory: string | null = null
  currentCategory: Category | undefined
  currentSubCategory: SubCategory | undefined
  currentSubCategories: SubCategory[] = []
  products: Product[] = []
  productsCopy: Product[] = []
  selectedProduct: Product | null = null
  selectedPriceFilters: string[] = [];
  userId: string | null = null
  cartId: string | null = null

  private userSubscription: Subscription | null = null

  isModalOpen = false
  isAddingToCart = false

  constructor(private route: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private spinnerService: SpinnerService,
    private userService: UserService,
    private shoppingCartService: ShoppingCartService) { }

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

    this.userSubscription = this.userService.user.subscribe((user) => {
      if (user) {
        this.userId = user.id
        this.loadUserCart()
      } else {
        this.userId = null
        this.cartId = null
      }
    })
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe()
    }
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

    this.products = filteredProducts
    this.productsCopy = this.products
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

  loadUserCart(): void {
    if (!this.userId) return

    this.shoppingCartService.getShoppingCartByUserId(this.userId).subscribe({
      next: (cart) => {
        this.cartId = cart.shoppingCartId || null
      },
      error: (err) => {
        console.error("Error loading cart:", err)
        this.cartId = null
      },
    })
  }

  addToCart(product: Product): void {
    if (!this.userId) {
      console.log("Please log in to add items to your cart.")
      return
    }

    this.isAddingToCart = true

    if (this.cartId) {
      this.shoppingCartService.addProductToCart(this.cartId, product).subscribe({
        next: () => {
          this.isAddingToCart = false
          this.shoppingCartService.notifyCartUpdated()
        },
        error: (err) => {
          console.error("Error adding product to cart:", err)
          this.isAddingToCart = false
        },
      })
    }
  }

}

