import { Category } from "./category";

export interface Product {
    productId: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    cover: string; 
    status: boolean;
    category: Category;
  }