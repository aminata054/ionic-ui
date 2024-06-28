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
    {
      id: '6',
      name: 'Article 6',
      price: 999,
      liked: true,
      quantity: 3,
      cover: 'assets/images/6.jpg',
      description: 'une description de la photo',
    },
    {
      id: '7',
      name: 'Article 7',
      price: 999,
      liked: true,
      quantity: 3,
      cover: 'assets/images/7.jpg',
      description: 'une description de la photo',
    },
    {
      id: '8',
      name: 'Article 8',
      price: 999,
      liked: true,
      quantity: 3,
      cover: 'assets/images/8.jpg',
      description: 'une description de la photo',
    },
  ]
total = 0;


category: any [] = [
  {
    id: '1',
    name: 'Electro',
    cover: 'assets/images/cat1.jpeg',
  },
  {
    id: '2',
    name: 'Maison',
    cover: 'assets/images/cat2.jpg',
  },
  {
    id: '3',
    name: 'Outils',
    cover: 'assets/images/cat3.jpg',
  },
  {
    id: '4',
    name: 'Jardin',
    cover: 'assets/images/cat4.jpg',
  },
  {
    id: '5',
    name: 'Lumière',
    cover: 'assets/images/cat5.jpg',
  },
]
  constructor() { }
}
