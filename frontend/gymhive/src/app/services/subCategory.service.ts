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
            console.log("SUB_CATEGORIES from CACHE")
            return of(cachedSubCategories);
        }

        const my_url = this.baseUrl + '/get-all-subcategories'

        //console.log("SUB_CATEGORIES from FETCH FIREBASE")


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
}