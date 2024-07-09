import { Product } from "./product";

export interface Cart {
    cartId: string;
    userId: string;
    productId: string;
    createdAt: Date;
    quantity: number;
    product?: Product; 
}
