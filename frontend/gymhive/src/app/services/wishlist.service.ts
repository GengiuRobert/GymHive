import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

import { WishList } from "../models/wishlist.model";
import { Product } from "../models/product.model";

@Injectable({ providedIn: 'root' })
export class WishlistService {

    private baseUrl = 'http://localhost:8080/wishlists';
    private wishListUpdatedSource = new Subject<void>()
    wishListUpdated$ = this.wishListUpdatedSource.asObservable()

    constructor(private http: HttpClient) { }

    notifyWishListUpdated(): void {
        this.wishListUpdatedSource.next()
    }

    createWishList(wishlistData: WishList): Observable<string> {

        const my_url = this.baseUrl + "/add-wishlist";

        return this.http.post(`${my_url}`, wishlistData, { responseType: 'text' });

    }

    deleteWishList(wishListId: string): Observable<string> {

        const my_url = `${this.baseUrl}/delete-wishlist-by-id/${wishListId}`;

        return this.http.delete(`${my_url}`, { responseType: 'text' });
    }

    getByWishlistId(wishListId: string): Observable<WishList> {

        const my_url = `${this.baseUrl}/get-wishlist-by-id/${wishListId}`;

        return this.http.get<WishList>(my_url);
    }

    getWishlistByUserId(userId: string): Observable<WishList> {

        const my_url = `${this.baseUrl}/get-wishlist-by-user-id/${userId}`;

        return this.http.get<WishList>(my_url);
    }

    addProductToWishList(wishListId: string, product: Product): Observable<WishList> {

        const my_url = `${this.baseUrl}/add-product/${wishListId}`;

        return this.http.put<WishList>(my_url, product);
    }

    removeProductWishList(wishListId: string | undefined, productId: string | undefined): Observable<WishList> {

        const my_url = `${this.baseUrl}/remove-product/${wishListId}/${productId}`;

        return this.http.delete<WishList>(my_url);
    }
}