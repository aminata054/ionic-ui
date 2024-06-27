import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  items: any[] = [
    {
      id: '1',
      name: 'Article 1',
      price: 999,
      liked: true,
      quantity: 1,
      cover: 'assets/images/1.jpg',
      description: 'une description de la photo',
    },
    {
      id: '2',
      name: 'Article 2',
      price: 999,
      liked: true,
      quantity: 4,
      cover: 'assets/images/2.jpg',
      description: 'une description de la photo',
    },
    {
      id: '3',
      name: 'Article 3',
      price: 999,
      liked: true,
      quantity: 7,
      cover: 'assets/images/3.jpg',
      description: 'une description de la photo',
    },
    {
      id: '4',
      name: 'Article 4',
      price: 999,
      liked: true,
      quantity: 2,
      cover: 'assets/images/4.jpg',
      description: 'une description de la photo',
    },
    {
      id: '5',
      name: 'Article 5',
      price: 999,
      liked: true,
      quantity: 3,
      cover: 'assets/images/5.jpg',
      description: 'une description de la photo',
    },
  ]
total = 0;
  constructor() { }
}
