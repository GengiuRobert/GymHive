import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, Observable, of, tap } from "rxjs";

import { Product } from "../models/product.model";

import { CacheService } from "./cachedata.service";

@Injectable({
    providedIn: 'root'
})

export class ProductService {

    private baseUrl = 'http://localhost:8080/products';
    private ALL_PRODUCTS_KEY = 'ALL_PRODUCTS';
    private survive_24H = 24 * 60 * 60 * 1000;

    constructor(private http: HttpClient, private cacheService: CacheService) { }

    getAllProducts(): Observable<Product[]> {

        const cachedProducts = this.cacheService.getDataFromCache<Product[]>(this.ALL_PRODUCTS_KEY)

        if (cachedProducts != null) {
            return of(cachedProducts);
        }

        const my_url = this.baseUrl + "/get-all-products";

        return this.http.get<Product[]>(my_url).pipe(
            tap((products) => {
                this.cacheService.setDataToCache(this.ALL_PRODUCTS_KEY, products, this.survive_24H)
            })
        );
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
}