import { Timestamp } from "firebase/firestore";

export interface Delivery {
    deliveryId: string;
    review: string;
    zone: string;
    deliveryDate: Timestamp;
    orderId: string;
}
