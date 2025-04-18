import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

import { ShoppingCart } from "../models/shopping-cart.model";
import { Product } from "../models/product.model";

@Injectable({ providedIn: 'root' })
export class ShoppingCartService {

    private baseUrl = 'http://localhost:8080/shopping-cart';
    private cartUpdatedSource = new Subject<void>()
    cartUpdated$ = this.cartUpdatedSource.asObservable()

    constructor(private http: HttpClient) { }

    notifyCartUpdated(): void {
        this.cartUpdatedSource.next()
    }

    createShoppingCart(shoppingCartData: ShoppingCart): Observable<string> {

        const my_url = this.baseUrl + "/add-shopping-cart";

        return this.http.post(`${my_url}`, shoppingCartData, { responseType: 'text' });
    }

    getShoppingCartByUserId(userId: string): Observable<ShoppingCart> {

        const my_url = `${this.baseUrl}/get-shopping-cart-by-user-id/${userId}`;

        return this.http.get<ShoppingCart>(my_url);
    }

    addProductToCart(shoppingCartId: string, product: Product, quantity?: number): Observable<ShoppingCart> {

        const qty = Math.max(1, quantity ?? 1);

        const params = new HttpParams().set('quantity', qty.toString());

        const my_url = `${this.baseUrl}/add-product/${shoppingCartId}`;

        return this.http.put<ShoppingCart>(my_url, product, { params });
    }

    removeProductFromCart(shoppingCartId: string, productId: string): Observable<ShoppingCart> {

        const my_url = `${this.baseUrl}/remove-product/${shoppingCartId}/${productId}`;

        return this.http.delete<ShoppingCart>(my_url);
    }

    removeAllOfTheSameProductsFromCart(shoppingCartId: string, productId: string): Observable<ShoppingCart> {
        const my_url = `${this.baseUrl}/remove-all/${shoppingCartId}/${productId}`;

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