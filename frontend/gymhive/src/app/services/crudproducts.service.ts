import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Product } from "../models/product.model";

@Injectable({
    providedIn: 'root'
})

export class ProductService{
    private baseUrl = 'http://localhost:8080/products';

    constructor(private http: HttpClient){}

    getAllProducts(): Observable<Product[]>{
        let my_url = this.baseUrl + "/getAllProducts";
        return this.http.get<Product[]>(my_url);
    }

    addProduct(product: Product): Observable<string>{
        let my_url = this.baseUrl + "/addProduct";
        return this.http.post(`${my_url}`, product, {responseType : 'text'});
    }

    updateProduct(productId: string, product: Product): Observable<string> {
        let my_url = this.baseUrl + "/updateProductById?productId=";
        return this.http.put(`${my_url}${productId}`,product, {responseType : 'text'});
    }

    deleteProduct(productId: string): Observable<string>{
        let my_url = this.baseUrl + "/deleteProductById?productId=";
        return this.http.delete(`${my_url}${productId}`, {responseType : 'text'});
    }
}