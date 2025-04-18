import { Product } from "./product.model";

export interface WishList {
    wishListId?: string;
    userId: string;
    userEmail: string;
    favoriteProducts?: Product[];
}