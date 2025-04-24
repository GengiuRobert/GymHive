import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

interface AdminSidebarNavItem {
  label: string
  icon: string
  route: string
}

@Component({
  selector: 'app-admin-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.css'
})
export class AdminSidebarComponent {
  @Input() isCollapsed = false

  navItems: AdminSidebarNavItem[] = [
    { label: "Dashboard", icon: "dashboard", route: "/admin" },
    { label: "Products", icon: "inventory", route: "/admin/products" },
    { label: "Categories", icon: "category", route: "/admin/categories" },
    { label: "Subcategories", icon: "subcategory", route: "/admin/subcategories" },
    { label: "Orders", icon: "shopping_cart", route: "/admin/orders" },
    { label: "User Activity", icon: "people", route: "/admin/user-activity" },
  ]
}
