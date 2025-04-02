import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { CategoryItem } from '../category-display/category-display.component';

import { UserService } from '../../services/user.service';
import { CategoryService } from '../../services/category.service';

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
  activeCategory: CategoryItem | null = null

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
