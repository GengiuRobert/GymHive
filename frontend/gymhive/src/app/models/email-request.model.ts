import { CartItem } from "./cart-item.models";

export interface EmailOrderRequest {
    firestoreID?: string,
    customerID: string,
    customerName: string;
    customerEmail: string;
    orderID: string;
    orderDate: String;
    items: CartItem[];
    address: {
        street: string;
        city: string;
        state: string;
        country: string;
        zipCode: string;
    };
    phone: string,
    shippingCost: number;
    tax: number;
}