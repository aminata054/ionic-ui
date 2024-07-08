import { Product } from './product';

export interface Wishlist {
  userId: string;
  productId: string;
  createdAt: Date;
  liked: boolean;
  wishlistId: string;
  product?: Product; 
}
