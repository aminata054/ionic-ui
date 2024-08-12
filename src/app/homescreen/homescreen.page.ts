import { Component, ElementRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Category } from '../models/category';
import { CategoryService } from '../services/category.service';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-homescreen',
  templateUrl: './homescreen.page.html',
  styleUrls: ['./homescreen.page.scss'],
})
export class HomescreenPage implements OnInit {
  userId: string = '';
  categories: Category[] | undefined;
  products: Product[] | any;
  user: User | undefined;
  firstname: string = '';
  searchField: FormControl;
  filteredProducts: Product[] | any;

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private productService: ProductService,
    private userService: UserService,
    private elementRef: ElementRef,
  ) {
    this.searchField = new FormControl('');
  }

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
      this.filteredProducts = products; 
    });

    this.searchField.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((searchTerm) => {
        this.filterProducts(searchTerm);
      });
  }

  filterProducts(searchTerm: string) {
    if (searchTerm) {
      this.filteredProducts = this.products.filter((product: { name: string; description: string; }) => {
        return product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               product.description.toLowerCase().includes(searchTerm.toLowerCase());
      });
      this.showSearchResults();
    } else {
      this.hideSearchResults();
      
    }
  }
  showSearchResults() {
    const searchResultsElement = this.elementRef.nativeElement.querySelector('.search-results');
    searchResultsElement.classList.add('show');
    searchResultsElement.classList.remove('hide');
  }

  hideSearchResults() {
    
    const searchResultsElement = this.elementRef.nativeElement.querySelector('.search-results');
    searchResultsElement.classList.add('hide');
    searchResultsElement.classList.remove('show');
  }
}