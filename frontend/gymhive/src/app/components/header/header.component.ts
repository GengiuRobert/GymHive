import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
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
  isAuthenticated = false;
  private userSub!: Subscription;

  constructor(private userService: UserService) { }

  ngOnInit(): void {

    this.userSub = this.userService.user.subscribe(user => {
      this.isAuthenticated = !!user
    })

  }

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
