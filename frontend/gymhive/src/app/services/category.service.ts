import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http";
import { forkJoin, map, Observable, of } from "rxjs";

import { SubCategoryService } from "./subCategory.service";
import { CacheService } from "./cachedata.service";

import { Category } from "../models/category.model";
import { SidebarItem } from "../models/categorySidebarItem.model";


@Injectable({
    providedIn: "root",
})
export class CategoryService {

    private baseUrl = 'http://localhost:8080/categories';
    private ALL_CATEGORIES_KEY = 'ALL_CATEGORIES';

    constructor(private http: HttpClient, private subCategoryService: SubCategoryService, private cacheService: CacheService) { }

    getAllCategories(): Observable<Category[]> {

        const cachedCategories = this.cacheService.getDataFromCache<Category[]>(this.ALL_CATEGORIES_KEY)

        if (cachedCategories != null) {
            return of(cachedCategories);
        }

        const my_url = this.baseUrl + '/get-all-categories'

        return this.http.get<Category[]>(my_url)
    }

    getSidebarItems(): Observable<SidebarItem[]> {
        return forkJoin({
            categories: this.getAllCategories(),
            subCategories: this.subCategoryService.getAllSubCategories()
        }).pipe(
            map(({ categories, subCategories }) => {
                return categories.map(category => {
                    const matchingSubCats = subCategories
                        .filter(sub => sub.parentCategoryId === category.categoryId)
                        .map(sub => sub.subCategoryName);
                    return {
                        name: category.categoryName,
                        link: `/category/${category.categoryName.toLowerCase()}`,
                        subcategories: matchingSubCats,
                        featured: [],
                        popularProducts: []
                    } as SidebarItem;
                });
            })
        );
    }

    getCategoryByType(type: string): Observable<SidebarItem | undefined> {
        return this.getSidebarItems().pipe(
            map((sidebarItems: SidebarItem[]) => {
                return sidebarItems.find((cat: SidebarItem) =>
                    cat.name.toLowerCase() === type.toLowerCase() || cat.link.includes(`/${type.toLowerCase()}`)
                );
            })
        );
    }

    getCategoryNameByCategoryId(categoryId: string): Observable<string> {
        return this.getAllCategories().pipe(
            map((categories: Category[]) => {
                const category = categories.find(cat => cat.categoryId === categoryId);
                return category ? category.categoryName : "";
            })
        );
    }

    addCategory(categoryData: Category): Observable<string> {

        const my_url = this.baseUrl + '/add-category'

        return this.http.post(my_url, categoryData, { responseType: 'text' })
    }

    deleteCategoryById(categoryId: string): Observable<string> {

        const my_url = `${this.baseUrl}/delete-category-by-id/${categoryId}`

        return this.http.delete(my_url, { responseType: 'text' })

    }

    updateCategoryById(categoryId: string, updatedCategory: Category): Observable<string> {

        const my_url = `${this.baseUrl}/update-category-by-id/${categoryId}`

        return this.http.put(my_url, updatedCategory, { responseType: "text" })

    }
}

