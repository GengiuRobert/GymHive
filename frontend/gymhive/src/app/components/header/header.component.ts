import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isMenuOpen = false
  isSearchOpen = false
  cartItemCount = 0 
  categories = [
    { name: "Equipment", link: "/category/equipment", subcategories: ["Weights", "Machines", "Accessories"] },
    { name: "Supplements", link: "/category/supplements", subcategories: ["Protein", "Pre-workout", "Vitamins"] },
    { name: "Apparel", link: "/category/apparel", subcategories: ["Men", "Women", "Accessories"] },
    { name: "Nutrition", link: "/category/nutrition", subcategories: ["Meal Plans", "Snacks", "Drinks"] },
  ]

  searchQuery = ""

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen
    if (this.isMenuOpen) {
      this.isSearchOpen = false
    }
  }

  toggleSearch(): void {
    this.isSearchOpen = !this.isSearchOpen
  }

  submitSearch(): void {
    console.log("Searching for:", this.searchQuery)
    this.isSearchOpen = false
  }

  @HostListener("window:resize", ["$event"])
  onResize(event: any): void {
    if (window.innerWidth > 768) {
      this.isMenuOpen = false
    }
  }
}
