import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable, of, tap } from "rxjs";

import { SubCategory } from "../models/subCategory.model";

import { CacheService } from "./cachedata.service";

@Injectable({ providedIn: 'root' })
export class SubCategoryService {

    private baseUrl = 'http://localhost:8080/subcategories';
    private ALL_SUBCATEGORIES_KEY = 'ALL_SUBCATEGORIES';

    constructor(private http: HttpClient, private cacheService: CacheService) { }

    getAllSubCategories(): Observable<SubCategory[]> {

        const cachedSubCategories = this.cacheService.getDataFromCache<SubCategory[]>(this.ALL_SUBCATEGORIES_KEY)

        if (cachedSubCategories != null) {
            return of(cachedSubCategories);
        }

        const my_url = this.baseUrl + '/get-all-subcategories'

        return this.http.get<SubCategory[]>(my_url)
    }

    getSubCategoryNameByCategoryId(subCategoryId: string): Observable<string> {
        return this.getAllSubCategories().pipe(
            map((subCategories: SubCategory[]) => {
                const subCategory = subCategories.find(subCat => subCat.subCategoryId === subCategoryId);
                return subCategory ? subCategory.subCategoryName : "";
            })
        );
    }

    addSubCategory(newSub: SubCategory): Observable<string> {

        const my_url = this.baseUrl + '/add-subcategory'

        return this.http.post(my_url, newSub, { responseType: 'text' })

    }

    deleteSubCategoryById(subCategoryId: string): Observable<string> {

        const my_url = `${this.baseUrl}/delete-subcategory-by-id/${subCategoryId}`

        return this.http.delete(my_url, { responseType: 'text' })

    }

    updateSubCategoryById(subCategoryId: string, updated: SubCategory): Observable<string> {

        const my_url = `${this.baseUrl}/update-subcategory-by-id/${subCategoryId}`

        return this.http.put(my_url, updated, { responseType: 'text' })

    }


}