import { Product } from "./product.model";

export interface ShoppingCart {
    shoppingCartId?: string;
    userId: string;
    userEmail: string;
    products?: Product[];
    totalPrice?: number;
    totalItems?: number;
}