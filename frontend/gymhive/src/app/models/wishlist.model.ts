import { Product } from "./product.model";

export interface WishList {
    wishListId?: String;
    userId: String;
    userEmail: String;
    favoriteProducts?: Product[];
}