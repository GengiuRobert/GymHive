import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";

import { SubCategory } from "../models/subCategory.model";


@Injectable({ providedIn: 'root' })
export class SubCategoryService {

    private baseUrl = 'http://localhost:8080/subcategories';

    constructor(private http: HttpClient) { }

    getAllSubCategories(): Observable<SubCategory[]> {
        let my_url = this.baseUrl + '/get-all-subcategories'

        return this.http.get<SubCategory[]>(my_url);
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