import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { forkJoin, map, mergeMap, Observable, of, switchMap, tap } from "rxjs";

import { Product } from "../models/product.model";

import { CacheService } from "./cachedata.service";
import { CategoryService } from "./category.service";
import { SubCategoryService } from "./subCategory.service";

@Injectable({
    providedIn: 'root'
})

export class ProductService {

    private baseUrl = 'http://localhost:8080/products';
    private ALL_PRODUCTS_KEY = 'ALL_PRODUCTS';

    constructor(private http: HttpClient,
        private cacheService: CacheService,
        private categoryService: CategoryService,
        private subCategoryService: SubCategoryService,) { }

    getAllProducts(): Observable<Product[]> {

        const cachedProducts = this.cacheService.getDataFromCache<Product[]>(this.ALL_PRODUCTS_KEY)

        if (cachedProducts != null) {
            return of(cachedProducts);
        }

        const my_url = this.baseUrl + "/get-all-products";

        return this.http.get<Product[]>(my_url).pipe(
            switchMap((products) => {
                if (!products || products.length === 0) {
                    return of([])
                }

                const productObservables = products.map((product) => {
                    return forkJoin({
                        categoryName: this.categoryService.getCategoryNameByCategoryId(product.categoryId),
                        subCategoryName: this.subCategoryService.getSubCategoryNameByCategoryId(product.subCategoryId),
                        product: of(product),
                    })
                })

                return forkJoin(productObservables).pipe(
                    map((results) => {
                        const productsWithImagePaths = results.map((result) => {
                            const catName = result.categoryName.toLowerCase().replace(/\s+/g, "_")
                            const subCatName = result.subCategoryName.toLowerCase().replace(/\s+/g, "_")
                            const imagePath = `assets/${catName}/${subCatName}/${result.product.imageUrl}`

                            return {
                                ...result.product,
                                imageUrl: imagePath,
                            }
                        })

                        return productsWithImagePaths
                    }),
                )
            }),
        )
    }

    addProduct(product: Product): Observable<string> {
        let my_url = this.baseUrl + "/add-product";
        return this.http.post(`${my_url}`, product, { responseType: 'text' });
    }

    updateProduct(productId: string, product: Product): Observable<string> {
        const my_url = this.baseUrl + "/update-product-by-id/" + productId;
        return this.http.put(`${my_url}`, product, { responseType: 'text' });
    }

    deleteProduct(productId: string): Observable<string> {
        const my_url = this.baseUrl + "/delete-product-by-id/" + productId;
        return this.http.delete(`${my_url}`, { responseType: 'text' });
    }

    getTwoRandomProducts(): Observable<Product[]> {
        return this.getAllProducts().pipe(
            map(products => {
                const total = products.length;
                let index1 = Math.floor(Math.random() * total);
                let index2 = Math.floor(Math.random() * total);
                while (index2 === index1) {
                    index2 = Math.floor(Math.random() * total);
                }
                return [products[index1], products[index2]];
            })
        );
    }

    getProductById(productId: string): Observable<Product | null> {
        const url = `${this.baseUrl}/get-product-by-id/${productId}`

        return this.http.get<Product | null>(url).pipe(

            mergeMap(product => {

                if (!product) {
                    return of(null)
                }

                return forkJoin({
                    categoryName: this.categoryService.getCategoryNameByCategoryId(product.categoryId),
                    subCategoryName: this.subCategoryService.getSubCategoryNameByCategoryId(product.subCategoryId),
                }).pipe(
                    map(({ categoryName, subCategoryName }) => {
                        const catFolder = categoryName.toLowerCase().replace(/\s+/g, '_')
                        const subCatFolder = subCategoryName.toLowerCase().replace(/\s+/g, '_')
                        const imagePath = `assets/${catFolder}/${subCatFolder}/${product.imageUrl}`

                        return { ...product, imageUrl: imagePath }
                    })
                )
            })
        )
    }
}