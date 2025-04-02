import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { CategoryItem } from '../category-display/category-display.component';

@Component({
  selector: 'app-category-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './category-sidebar.component.html',
  styleUrl: './category-sidebar.component.css'
})
export class CategorySidebarComponent implements OnInit {
  @Input() categoryType = ""
  @Input() activeSubcategory: string | null = null
  @Input() showFilters = true

  category: CategoryItem | undefined
  currentUrl = ""

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    // Get the category data from the service
    this.category = this.categoryService.getCategoryByType(this.categoryType)

    // Get current URL for active state
    this.currentUrl = window.location.pathname
  }
}
