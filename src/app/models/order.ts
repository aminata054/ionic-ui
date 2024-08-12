import { Product } from "./product";

export interface Order {
    orderId: string;
    userId: string;
    status: string;
    products: Product[];
    totalPrice: number;
    createdAt: Date;
    orderNumber: number;
}
