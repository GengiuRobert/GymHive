import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http";
import { forkJoin, map, Observable } from "rxjs";

import { SubCategoryService } from "./subCategory.service";

import { Category } from "../models/category.model";
import { SidebarItem } from "../models/categorySidebarItem.model";

@Injectable({
    providedIn: "root",
})
export class CategoryService {

    private baseUrl = 'http://localhost:8080/categories';

    constructor(private http: HttpClient, private subCategoryService: SubCategoryService) { }

    getAllCategories(): Observable<Category[]> {
        let my_url = this.baseUrl + '/get-all-categories'

        return this.http.get<Category[]>(my_url);
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
}

