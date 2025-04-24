import { Routes } from '@angular/router';

import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { CategoryDisplayComponent } from './components/category-display/category-display.component';
import { NotFoundFallbackComponent } from './components/not-found-fallback/not-found-fallback.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { CategoryFormComponent } from './components/category-form/category-form.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { SubcategoryFormComponent } from './components/subcategory-form/subcategory-form.component';
import { SubcategoryListComponent } from './components/subcategory-list/subcategory-list.component';
import { UserActivityListComponent } from './components/user-activity-list/user-activity-list.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    {
        path: 'admin',
        component: AdminLayoutComponent,
        children: [
            { path: '', component: AdminDashboardComponent },
            { path: 'products', component: ProductListComponent },
            { path: 'products/new', component: ProductFormComponent },
            { path: 'products/edit/:id', component: ProductFormComponent },
            { path: 'categories', component: CategoryListComponent },
            { path: 'categories/new', component: CategoryFormComponent },
            { path: 'categories/edit/:id', component: CategoryFormComponent },
            { path: 'subcategories', component: SubcategoryListComponent },
            { path: 'subcategories/new', component: SubcategoryFormComponent },
            { path: 'subcategories/edit/:id', component: SubcategoryFormComponent },
            { path: 'orders', component: OrderListComponent },
            { path: 'orders/:id', component: OrderDetailsComponent },
            { path: 'user-activity', component: UserActivityListComponent },
        ]
    },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'account', component: UserProfileComponent },
    { path: 'checkout', component: CheckoutComponent },
    {
        path: "category/equipment",
        component: CategoryDisplayComponent,
        data: { categoryType: "equipment" },
    },
    {
        path: "category/equipment/:subcategory",
        component: CategoryDisplayComponent,
        data: { categoryType: "equipment" },
    },
    {
        path: "category/supplements",
        component: CategoryDisplayComponent,
        data: { categoryType: "supplements" },
    },
    {
        path: "category/supplements/:subcategory",
        component: CategoryDisplayComponent,
        data: { categoryType: "supplements" },
    },
    {
        path: "category/apparel",
        component: CategoryDisplayComponent,
        data: { categoryType: "apparel" },
    },
    {
        path: "category/apparel/:subcategory",
        component: CategoryDisplayComponent,
        data: { categoryType: "apparel" },
    },
    {
        path: "category/nutrition",
        component: CategoryDisplayComponent,
        data: { categoryType: "nutrition" },
    },
    {
        path: "category/nutrition/:subcategory",
        component: CategoryDisplayComponent,
        data: { categoryType: "nutrition" },
    },
    { path: "**", component: NotFoundFallbackComponent },
];
