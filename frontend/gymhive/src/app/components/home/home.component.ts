import { Component, inject, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { finalize } from "rxjs";

import { Product } from "../../models/product.model"

import { ProductDetailsModalComponent } from "../product-details-modal/product-details-modal.component";
import { LoadingSpinnerComponent } from "../loading-spinner/loading-spinner.component";

import { ProductService } from "../../services/crudproducts.service";
import { SpinnerService } from "../../services/spinner.service";
import { CacheManagerService } from "../../services/cache-manager.service";

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
  private spinnerService = inject(SpinnerService)
  private cacheManager = inject(CacheManagerService)

  ngOnInit(): void {
    this.spinnerService.showSpinner()
    this.isCachedDataUsed()
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


}