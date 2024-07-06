import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  items: any[] = [
    {
      id: '1',
      name: 'Chauffe-eau',
      price: 12500,
      liked: true,
      quantity: 1,
      cover: 'assets/images/1.jpg',
      description: 'Cet appareil chauffe l\'eau uniquement lorsqu\'elle est demandée, offrant ainsi une source continue d\'eau chaude. Ces appareils sont plus compacts et peuvent être plus efficaces sur le plan énergétique car ils n\'ont pas de pertes de chaleur dues au stockage de l\'eau.',
    },
    {
      id: '2',
      name: 'Iphone 12',
      price: 200000,
      liked: true,
      quantity: 1,
      cover: 'assets/images/2.jpg',
      description: 'L\'iPhone 12 est un modèle de smartphone conçu et fabriqué par Apple Inc. Lancé en octobre 2020, il fait partie de la quatorzième génération de l\'iPhone et apporte plusieurs améliorations par rapport à ses prédécesseurs en termes de design, de performance et de fonctionnalités.',
    },
    {
      id: '3',
      name: 'Set d\'outils',
      price: 23000,
      liked: true,
      quantity: 7,
      cover: 'assets/images/3.jpg',
      description: 'Ce set d\'outils de travail manuel est une collection d\'outils divers conçus pour effectuer des tâches manuelles variées, telles que la construction, la réparation, l\'entretien et l\'artisanat. Ces sets sont généralement utilisés par les bricoleurs, les artisans et les professionnels de divers métiers.',
    },
    {
      id: '4',
      name: 'Machine à café',
      price: 10000,
      liked: true,
      quantity: 2,
      cover: 'assets/images/4.jpg',
      description: 'Cette machine prépare du café en faisant passer de l\'eau chaude à travers un filtre contenant du café moulu.',
    },
    {
      id: '5',
      name: 'Rangement de chaussures',
      price: 7500,
      liked: true,
      quantity: 3,
      cover: 'assets/images/5.jpg',
      description: 'Cette étagère à chaussure est conçue pour organiser et stocker des chaussures de manière ordonnée, pratique et esthétique.',
    },
    {
      id: '6',
      name: 'Souris',
      price: 1000,
      liked: true,
      quantity: 2,
      cover: 'assets/images/6.jpg',
      description: 'Utilise un capteur optique pour détecter le mouvement sur une surface et emet une lumière rouge pour illuminer la surface et capter les mouvements.',
    },
    {
      id: '7',
      name: 'Ordinateur portable',
      price: 999,
      liked: true,
      quantity: 3,
      cover: 'assets/images/7.jpg',
      description: 'une description de l\'ordinateur',
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
