import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { CategoryDisplayComponent } from './components/category-display/category-display.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'admin', component: AdminDashboardComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'account', component: UserProfileComponent },

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
        path: "category/equipment/new",
        component: CategoryDisplayComponent,
        data: { categoryType: "equipment", featured: "new" },
    },
    {
        path: "category/equipment/best-sellers",
        component: CategoryDisplayComponent,
        data: { categoryType: "equipment", featured: "best-sellers" },
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
        path: "category/supplements/new",
        component: CategoryDisplayComponent,
        data: { categoryType: "supplements", featured: "new" },
    },
    {
        path: "category/supplements/top-rated",
        component: CategoryDisplayComponent,
        data: { categoryType: "supplements", featured: "top-rated" },
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
        path: "category/apparel/new",
        component: CategoryDisplayComponent,
        data: { categoryType: "apparel", featured: "new" },
    },
    {
        path: "category/apparel/essentials",
        component: CategoryDisplayComponent,
        data: { categoryType: "apparel", featured: "essentials" },
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
    {
        path: "category/nutrition/meal-prep",
        component: CategoryDisplayComponent,
        data: { categoryType: "nutrition", featured: "meal-prep" },
    },
    {
        path: "category/nutrition/snacks",
        component: CategoryDisplayComponent,
        data: { categoryType: "nutrition", featured: "snacks" },
    },

];
