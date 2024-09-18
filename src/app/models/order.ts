import { Timestamp } from "firebase/firestore";
import { Product } from "./product";

export interface Order {
    orderId: string;
    userId: string;
    status: string;
    statusHistory: any[];
    products: Product[];
    totalPrice: number;
    createdAt: Timestamp;
    orderNumber: number;
}
