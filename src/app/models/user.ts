export interface User {
    userId: string;
    role: string;
    name: string;
    firstname: string;
    country: string;
    address: string;
    city: string;
    tel: string;
    email: string;
    deliveryMethod: string;
    paymentMethod: string;
    createdAt: number;
    isAdmin: boolean;
    profileComplete: boolean;
}
