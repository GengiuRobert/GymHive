import { Component, inject, OnDestroy, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { finalize, Subscription } from "rxjs";

import { Product } from "../../models/product.model"

import { ProductDetailsModalComponent } from "../product-details-modal/product-details-modal.component";
import { LoadingSpinnerComponent } from "../loading-spinner/loading-spinner.component";

import { ProductService } from "../../services/crudproducts.service";
import { SpinnerService } from "../../services/spinner.service";
import { CacheManagerService } from "../../services/cache-manager.service";
import { ShoppingCartService } from "../../services/shopping-cart.service";
import { UserService } from "../../services/user.service";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, RouterModule, ProductDetailsModalComponent, LoadingSpinnerComponent],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit,OnDestroy {

  featuredProducts: Product[] = []
  selectedProduct: Product | null = null
  userId: string | null = null
  cartId: string | null = null

  isModalOpen = false
  isAddingToCart = false

  private userSubscription: Subscription | null = null

  categories = [
    { name: "Equipment", link: "/category/equipment" },
    { name: "Supplements", link: "/category/supplements" },
    { name: "Apparel", link: "/category/apparel" },
    { name: "Nutrition", link: "/category/nutrition" },
  ]

  private productsService = inject(ProductService)
  private spinnerService = inject(SpinnerService)
  private cacheManager = inject(CacheManagerService)
  private shoppingCartService = inject(ShoppingCartService)
  private userService = inject(UserService)

  ngOnInit(): void {
    this.spinnerService.showSpinner()
    this.isCachedDataUsed()
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

  isCachedDataUsed() {
    this.cacheManager.refreshAllData().subscribe({
      next: (wasRefreshed) => {
        console.log(wasRefreshed ? "Data was refreshed from API" : "Using cached data")
        this.loadFeaturedProducstShowcase()
      },
      error: (err) => {
        console.error("Error refreshing cache:", err)
        this.loadFeaturedProducstShowcase()
      },
    })
  }

  loadFeaturedProducstShowcase() {
    this.productsService.getTwoRandomProducts().pipe(finalize(() => this.spinnerService.hideSpinner())).subscribe((randomProds) => {
      this.featuredProducts = randomProds
    })
  }

  openProductDetails(product: Product) {
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