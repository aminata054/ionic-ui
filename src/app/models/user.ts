export interface User {
    userId: string;
    role: string;
    name: string;
    firstname: string;
    country: string;
    address: string;
    city: string;
    tel: number;
    email: string;
    password: string;
    deliveryMethod: string;
    paymentMethod: string;
    createdAt: number;
    isAdmin: boolean;
}
