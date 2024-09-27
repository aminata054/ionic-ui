import { Component, ElementRef, OnInit } from '@angular/core';
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
    // Champs de recherche initialisé pour capturer les saisies de l'utilisateur
    this.searchField = new FormControl('');
  }

  /**
   * Fonction d'initialisation qui se déclenche au chargement de la page.
   * Elle charge les informations de l'utilisateur, des catégories et des produits.
   */
  ngOnInit() {
    // Récupère l'ID de l'utilisateur à partir de la route active
    
    // Charge les informations de l'utilisateur
    

    // Charge les catégories disponibles
    this.categoryService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });

    // Charge les produits disponibles
    this.productService.getProducts().subscribe((products) => {
      this.products = products;
      this.filteredProducts = products; // Initialise les produits filtrés avec tous les produits
    });

    // Filtre les produits à chaque changement de texte dans le champ de recherche
    this.searchField.valueChanges
      .pipe(
        debounceTime(500), // Attente de 500ms après la saisie avant de déclencher la recherche
        distinctUntilChanged() // Ne déclenche la recherche que si la valeur a réellement changé
      )
      .subscribe((searchTerm) => {
        this.filterProducts(searchTerm); // Filtre les produits en fonction du terme recherché
      });
  }

  /**
   * Filtre les produits selon le terme de recherche saisi par l'utilisateur.
   * @param searchTerm - Le texte saisi dans le champ de recherche.
   */
  filterProducts(searchTerm: string) {
    if (searchTerm) {
      this.filteredProducts = this.products.filter((product: { name: string; description: string; }) => {
        return product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               product.description.toLowerCase().includes(searchTerm.toLowerCase());
      });
      this.showSearchResults(); // Affiche les résultats de la recherche
    } else {
      this.hideSearchResults(); // Masque les résultats si aucun terme de recherche
    }
  }

  /**
   * Affiche les résultats de recherche.
   */
  showSearchResults() {
    const searchResultsElement = this.elementRef.nativeElement.querySelector('.search-results');
    searchResultsElement.classList.add('show');
    searchResultsElement.classList.remove('hide');
  }

  /**
   * Masque les résultats de recherche.
   */
  hideSearchResults() {
    const searchResultsElement = this.elementRef.nativeElement.querySelector('.search-results');
    searchResultsElement.classList.add('hide');
    searchResultsElement.classList.remove('show');
  }
}
