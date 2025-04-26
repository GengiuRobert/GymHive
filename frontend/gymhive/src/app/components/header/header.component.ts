import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { ProductDetailsModalComponent } from "../product-details-modal/product-details-modal.component";
import { SearchResultsComponent } from "../search-results/search-results.component";
import { ShoppingCartModalComponent } from "../shopping-cart-modal/shopping-cart-modal.component";
import { WebsocketNotificationComponent } from "../websocket-notification/websocket-notification.component";

import { SidebarItem } from '../../models/categorySidebarItem.model';
import { Product } from '../../models/product.model';

import { UserService } from '../../services/user.service';
import { SearchService } from '../../services/search.service';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { WebSocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule, FormsModule, ProductDetailsModalComponent, SearchResultsComponent, ShoppingCartModalComponent, WebsocketNotificationComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isMenuOpen = false
  isSearchOpen = false
  cartItemCount = 0
  searchQuery = ""
  isAuthenticated = false;
  isSearching = false
  showSearchResults = false
  isModalOpen = false
  isCartModalOpen = false
  isAdmin = false

  private userSub!: Subscription;
  private searchSub!: Subscription
  private cartUpdateSub!: Subscription

  activeCategory: SidebarItem | null = null
  searchResults: any[] = []
  selectedProduct: Product | null = null
  userId: string | null = null

  categories = [
    {
      name: "Equipment",
      link: "/category/equipment",
    },
    {
      name: "Supplements",
      link: "/category/supplements",
    },
    {
      name: "Apparel",
      link: "/category/apparel",
    },
    {
      name: "Nutrition",
      link: "/category/nutrition"
    }
  ]

  constructor(private userService: UserService, private searchService: SearchService, private shoppingCartService: ShoppingCartService, private webSocketService: WebSocketService) { }

  ngOnInit(): void {

    this.userSub = this.userService.user.subscribe(user => {
      this.isAuthenticated = !!user
      if (user) {

        if (user.email === 'admin@gmail.com') {
          this.isAdmin = true
        }

        this.userId = user.id
        this.loadCartItemCount()
      } else {
        this.userId = null
        this.cartItemCount = 0
      }
    })

    this.searchSub = this.searchService.searchResults$.subscribe((results) => {
      this.searchResults = results
    })

    this.searchService.isSearching$.subscribe((isSearching) => {
      this.isSearching = isSearching
    })

    this.searchService.selectedProduct$.subscribe((product) => {
      if (product) {
        this.selectedProduct = product
        this.isModalOpen = true
      }
    })

    this.cartUpdateSub = this.shoppingCartService.cartUpdated$.subscribe(() => {
      if (this.userId) {
        this.loadCartItemCount()
      }
    })
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe()
    }
    if (this.searchSub) {
      this.searchSub.unsubscribe()
    }
    if (this.cartUpdateSub) {
      this.cartUpdateSub.unsubscribe()
    }
  }

  loadCartItemCount(): void {
    if (!this.userId) return

    this.shoppingCartService.getShoppingCartByUserId(this.userId).subscribe({
      next: (cart) => {
        this.cartItemCount = cart.totalItems || 0
      },
      error: (err) => {
        console.error("Error loading cart:", err)
        this.cartItemCount = 0
      },
    })
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen
    if (this.isMenuOpen) {
      this.isSearchOpen = false
      this.showSearchResults = false
    }
  }

  toggleCartModal(event: Event): void {
    event.preventDefault()
    this.isCartModalOpen = !this.isCartModalOpen
    if (this.isCartModalOpen) {
      this.isSearchOpen = false
      this.showSearchResults = false
      this.isMenuOpen = false
    }
  }

  closeCartModal(): void {
    this.isCartModalOpen = false
    if (this.userId) {
      this.loadCartItemCount()
    }
  }

  toggleSearch(): void {
    this.isSearchOpen = !this.isSearchOpen
    if (!this.isSearchOpen) {
      this.showSearchResults = false
    } else {
      this.searchQuery = ""
    }
  }


  submitSearch(): void {
    if (this.searchQuery.trim().length > 0) {
      this.searchService.search(this.searchQuery).subscribe((results) => {
        this.showSearchResults = true
      })
    }
  }

  onSearchInput(): void {
    if (this.searchQuery.trim().length >= 2) {
      this.searchService.search(this.searchQuery).subscribe((results) => {
        this.showSearchResults = true
      })
    } else {
      this.searchResults = []
      this.showSearchResults = false
    }
  }

  selectProduct(product: Product): void {
    this.searchService.selectProduct(product)
    this.isSearchOpen = false
    this.showSearchResults = false
  }

  closeSearchResults(): void {
    this.showSearchResults = false
  }

  closeModal(): void {
    this.isModalOpen = false
    this.selectedProduct = null
  }

  @HostListener("window:resize", ["$event"])
  onResize(event: any): void {
    if (window.innerWidth > 768) {
      this.isMenuOpen = false
    }
  }

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: MouseEvent): void {
    const searchContainer = document.querySelector(".search-container")
    const searchResults = document.querySelector(".search-results-container")

    if (searchContainer && searchResults) {
      if (!searchContainer.contains(event.target as Node) && !searchResults.contains(event.target as Node)) {
        this.showSearchResults = false
      }
    }
  }

}
