import { Category } from "./category";

export interface Product {
    productId: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    cover: string; 
    category: Category;
    available: boolean;
  }