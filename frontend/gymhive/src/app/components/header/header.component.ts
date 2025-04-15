import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { ProductDetailsModalComponent } from "../product-details-modal/product-details-modal.component";
import { SearchResultsComponent } from "../search-results/search-results.component";

import { SidebarItem } from '../../models/categorySidebarItem.model';
import { Product } from '../../models/product.model';

import { UserService } from '../../services/user.service';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule, FormsModule, ProductDetailsModalComponent, SearchResultsComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isMenuOpen = false
  isSearchOpen = false
  cartItemCount = 0

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

  searchQuery = ""
  isAuthenticated = false;
  private userSub!: Subscription;
  activeCategory: SidebarItem | null = null
  private searchSub!: Subscription
  searchResults: any[] = []
  isSearching = false
  showSearchResults = false
  selectedProduct: Product | null = null
  isModalOpen = false

  constructor(private userService: UserService, private searchService: SearchService) { }

  ngOnInit(): void {

    this.userSub = this.userService.user.subscribe(user => {
      this.isAuthenticated = !!user
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
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe()
    }
    if (this.searchSub) {
      this.searchSub.unsubscribe()
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen
    if (this.isMenuOpen) {
      this.isSearchOpen = false
      this.showSearchResults = false
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
