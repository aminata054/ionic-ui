import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { Category } from '../models/category';
import { CategoryService } from '../services/category.service';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';

@Component({
  selector: 'app-homescreen',
  templateUrl: './homescreen.page.html',
  styleUrls: ['./homescreen.page.scss'],
})
export class HomescreenPage implements OnInit {
  userId: string = '';
  categories: Category[] | undefined;
  products: Product[] | undefined;
  user: User | undefined ;
  firstname: string = '';

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private productService: ProductService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('userId') || '';
    this.userService.getUser(this.userId).subscribe((user) => {
      this.user = user;
      if (user) {
        this.firstname = user.firstname || '';
      }
    });
    this.categoryService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });

    this.productService.getProducts().subscribe((products) => {
      this.products = products;
    });
  }
}
