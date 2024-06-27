import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {

  constructor() { }
  ngOnInit() {
    this.getItems();
  }
  items: any[] = [];
  allItems: any[] = [];
total = 0;
  private api = inject(ApiService);

  getItems() {
    this.allItems = this.api.items;
    this.items = [...this.allItems];
  }

  addQuantity(index: number) {
    this.items[index].quantity++;
  }
  minusQuantity(index: number) {
    if (this.items[index].quantity > 1 ) {
      this.items[index].quantity--;
    } else {
      this.items = this.items.filter((item) => item.id != this.items[index].id)
    }
  }
}
