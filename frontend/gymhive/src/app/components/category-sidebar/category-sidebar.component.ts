import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CategoryService } from '../../services/category.service';

import { SidebarItem } from '../../models/categorySidebarItem.model';

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

  category: SidebarItem | undefined
  currentUrl = ""

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.categoryService.getCategoryByType(this.categoryType).subscribe({
      next: (cat) => {
        this.category = cat;
      },
      error: (err) => {
        console.error('Error fetching category:', err);
      }
    });

    this.currentUrl = window.location.pathname;
  }
}
