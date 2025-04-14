import { CacheService } from "./cachedata.service";
import { Injectable } from "@angular/core";
import { catchError, forkJoin, map, Observable, of, tap } from "rxjs";
import { CategoryService } from "./category.service";
import { SubCategoryService } from "./subCategory.service";
import { ProductService } from "./crudproducts.service";

@Injectable({
    providedIn: 'root'
})
export class CacheManagerService {
    private ALL_CATEGORIES_KEY = 'ALL_CATEGORIES';
    private ALL_SUBCATEGORIES_KEY = 'ALL_SUBCATEGORIES';
    private ALL_PRODUCTS_KEY = 'ALL_PRODUCTS';
    private LAST_REFRESH_KEY = 'LAST_CACHE_REFRESH';
    private REFRESH_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

    constructor(
        private cacheService: CacheService,
        private categoryService: CategoryService,
        private subcategoryService: SubCategoryService,
        private productsService: ProductService
    ) { }

    shouldRefreshCache(): boolean {
        const lastRefresh = localStorage.getItem('GymHiveCache_' + this.LAST_REFRESH_KEY);
        if (!lastRefresh) return true;

        const lastRefreshTime = parseInt(lastRefresh, 10);
        return (Date.now() - lastRefreshTime) > this.REFRESH_INTERVAL;
    }

    refreshAllData(): Observable<boolean> {
        if (!this.shouldRefreshCache()) {
            console.log("Cache is still fresh, using cached data");
            return of(false);
        }

        console.log("Refreshing all application data...");


        return forkJoin({
            categories: this.categoryService.getAllCategories(),
            subcategories: this.subcategoryService.getAllSubCategories(),
            products: this.productsService.getAllProducts()
        }).pipe(
            tap(data => {

                this.cacheService.setDataToCache(this.ALL_CATEGORIES_KEY, data.categories, this.REFRESH_INTERVAL);
                this.cacheService.setDataToCache(this.ALL_SUBCATEGORIES_KEY, data.subcategories, this.REFRESH_INTERVAL);
                this.cacheService.setDataToCache(this.ALL_PRODUCTS_KEY, data.products, this.REFRESH_INTERVAL);

                localStorage.setItem('GymHiveCache_' + this.LAST_REFRESH_KEY, Date.now().toString());

                console.log("All application data refreshed and cached");
            }),
            map(() => true),
            catchError(error => {
                console.error("Error refreshing application data:", error);
                return of(false);
            })
        );
    }
}