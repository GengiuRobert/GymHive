import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ShoppingCart } from "../models/shopping-cart.model";
import { Product } from "../models/product.model";

@Injectable({ providedIn: 'root' })
export class ShoppingCartService {

    private baseUrl = 'http://localhost:8080/shopping-cart';

    constructor(private http: HttpClient) { }

    createShoppingCart(shoppingCartData: ShoppingCart): Observable<string> {

        const my_url = this.baseUrl + "/add-shopping-cart";

        return this.http.post(`${my_url}`, shoppingCartData, { responseType: 'text' });
    }

    getShoppingCartByUserId(userId: string): Observable<ShoppingCart> {

        const my_url = `${this.baseUrl}/get-shopping-cart-by-user-id/${userId}`;

        return this.http.get<ShoppingCart>(my_url);
    }

    addProductToCart(shoppingCartId: string, product: Product): Observable<ShoppingCart> {

        const my_url = `${this.baseUrl}/add-product/${shoppingCartId}`;

        return this.http.put<ShoppingCart>(my_url, product);
    }

    removeProductFromCart(shoppingCartId: string, productId: string): Observable<ShoppingCart> {

        const my_url = `${this.baseUrl}/remove-product/${shoppingCartId}/${productId}`;

        return this.http.delete<ShoppingCart>(my_url);
    }

    updateShoppingCart(shoppingCartId: string, shoppingCartData: ShoppingCart): Observable<string> {

        const my_url = `${this.baseUrl}/update-shopping-cart-by-id/${shoppingCartId}`;

        return this.http.put(`${my_url}`, shoppingCartData, { responseType: 'text' });
    }

    deleteShoppingCart(shoppingCartId: string): Observable<string> {

        const my_url = `${this.baseUrl}/delete-shopping-cart-by-id/${shoppingCartId}`;

        return this.http.delete(`${my_url}`, { responseType: 'text' });
    }


}