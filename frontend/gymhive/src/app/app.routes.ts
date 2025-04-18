import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { CategoryDisplayComponent } from './components/category-display/category-display.component';
import { NotFoundFallbackComponent } from './components/not-found-fallback/not-found-fallback.component';

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
