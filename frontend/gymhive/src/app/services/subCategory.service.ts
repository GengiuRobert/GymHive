import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable, of, tap } from "rxjs";

import { SubCategory } from "../models/subCategory.model";

import { CacheService } from "./cachedata.service";

@Injectable({ providedIn: 'root' })
export class SubCategoryService {

    private baseUrl = 'http://localhost:8080/subcategories';
    private ALL_SUBCATEGORIES_KEY = 'ALL_SUBCATEGORIES';
    private survive_24H = 24 * 60 * 60 * 1000;

    constructor(private http: HttpClient, private cacheService: CacheService) { }

    getAllSubCategories(): Observable<SubCategory[]> {

        const cachedSubCategories = this.cacheService.getDataFromCache<SubCategory[]>(this.ALL_SUBCATEGORIES_KEY)

        if (cachedSubCategories != null) {
            return of(cachedSubCategories);
        }

        const my_url = this.baseUrl + '/get-all-subcategories'

        return this.http.get<SubCategory[]>(my_url).pipe(
            tap((subCategories) => {
                this.cacheService.setDataToCache(this.ALL_SUBCATEGORIES_KEY, subCategories, this.survive_24H)
            })
        );
    }

    getSubCategoryNameByCategoryId(subCategoryId: string): Observable<string> {
        return this.getAllSubCategories().pipe(
            map((subCategories: SubCategory[]) => {
                const subCategory = subCategories.find(subCat => subCat.subCategoryId === subCategoryId);
                return subCategory ? subCategory.subCategoryName : "";
            })
        );
    }
}