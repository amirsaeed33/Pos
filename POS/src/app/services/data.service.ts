import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, forkJoin } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly BASE_PATH = 'assets/data/';
  
  // Local storage keys
  private readonly PRODUCTS_KEY = 'mithai_products';
  private readonly SHOPS_KEY = 'mithai_shops';
  private readonly ORDERS_KEY = 'mithai_orders';
  private readonly CATEGORIES_KEY = 'mithai_categories';

  // Track when data is ready
  private dataReady = new BehaviorSubject<boolean>(false);
  public dataReady$ = this.dataReady.asObservable();

  constructor(private http: HttpClient) {
    this.initializeData();
  }

  /**
   * Initialize data from JSON files on first load
   * This loads data from JSON files and stores in localStorage for persistence
   */
  private initializeData(): void {
    console.log('🔄 DataService: Initializing data...');
    
    const loadOperations: Observable<any>[] = [];

    // Check if data already exists in localStorage
    if (!localStorage.getItem(this.PRODUCTS_KEY)) {
      console.log('📦 Loading products from JSON file...');
      loadOperations.push(
        this.loadFromFile('products.json').pipe(
          tap((data) => {
            console.log('✅ Products loaded:', data);
            localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(data));
            console.log('💾 Products saved to localStorage');
          })
        )
      );
    } else {
      console.log('✅ Products already in localStorage');
    }

    if (!localStorage.getItem(this.SHOPS_KEY)) {
      console.log('🏪 Loading shops from JSON file...');
      loadOperations.push(
        this.loadFromFile('shops.json').pipe(
          tap((data) => {
            console.log('✅ Shops loaded:', data);
            localStorage.setItem(this.SHOPS_KEY, JSON.stringify(data));
          })
        )
      );
    } else {
      console.log('✅ Shops already in localStorage');
    }

    if (!localStorage.getItem(this.ORDERS_KEY)) {
      console.log('📋 Loading orders from JSON file...');
      loadOperations.push(
        this.loadFromFile('orders.json').pipe(
          tap((data) => {
            console.log('✅ Orders loaded:', data);
            localStorage.setItem(this.ORDERS_KEY, JSON.stringify(data));
          })
        )
      );
    } else {
      console.log('✅ Orders already in localStorage');
    }

    if (!localStorage.getItem(this.CATEGORIES_KEY)) {
      console.log('🏷️ Loading categories from JSON file...');
      loadOperations.push(
        this.loadFromFile('categories.json').pipe(
          tap((data) => {
            console.log('✅ Categories loaded:', data);
            localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(data));
          })
        )
      );
    } else {
      console.log('✅ Categories already in localStorage');
    }

    // If we need to load from files, wait for all to complete
    if (loadOperations.length > 0) {
      forkJoin(loadOperations).subscribe({
        next: () => {
          console.log('✅ All data loaded and saved to localStorage!');
          this.dataReady.next(true);
        },
        error: (error) => {
          console.error('❌ Error loading data:', error);
          this.dataReady.next(true); // Still mark as ready, will use empty arrays
        }
      });
    } else {
      console.log('✅ All data already in localStorage, ready immediately!');
      this.dataReady.next(true);
    }
  }

  /**
   * Load data from JSON file
   */
  private loadFromFile<T>(filename: string): Observable<T> {
    return this.http.get<T>(`${this.BASE_PATH}${filename}`).pipe(
      catchError(error => {
        console.error(`Error loading ${filename}:`, error);
        return of([] as T);
      })
    );
  }

  /**
   * Get data from localStorage
   */
  getData<T>(key: string): T | null {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  /**
   * Save data to localStorage
   */
  saveData<T>(key: string, data: T): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  /**
   * Products operations
   */
  getProducts(): any[] {
    return this.getData(this.PRODUCTS_KEY) || [];
  }

  saveProducts(products: any[]): void {
    this.saveData(this.PRODUCTS_KEY, products);
  }

  /**
   * Shops operations
   */
  getShops(): any[] {
    return this.getData(this.SHOPS_KEY) || [];
  }

  saveShops(shops: any[]): void {
    this.saveData(this.SHOPS_KEY, shops);
  }

  /**
   * Orders operations
   */
  getOrders(): any[] {
    return this.getData(this.ORDERS_KEY) || [];
  }

  saveOrders(orders: any[]): void {
    this.saveData(this.ORDERS_KEY, orders);
  }

  /**
   * Categories operations
   */
  getCategories(): any[] {
    return this.getData(this.CATEGORIES_KEY) || [];
  }

  saveCategories(categories: any[]): void {
    this.saveData(this.CATEGORIES_KEY, categories);
  }

  /**
   * Export data to JSON (for backup)
   */
  exportToJSON(): { products: any[], shops: any[], orders: any[], categories: any[] } {
    return {
      products: this.getProducts(),
      shops: this.getShops(),
      orders: this.getOrders(),
      categories: this.getCategories()
    };
  }

  /**
   * Import data from JSON (for restore)
   */
  importFromJSON(data: { products?: any[], shops?: any[], orders?: any[], categories?: any[] }): void {
    if (data.products) this.saveProducts(data.products);
    if (data.shops) this.saveShops(data.shops);
    if (data.orders) this.saveOrders(data.orders);
    if (data.categories) this.saveCategories(data.categories);
  }

  /**
   * Clear all data (reset)
   */
  clearAllData(): void {
    localStorage.removeItem(this.PRODUCTS_KEY);
    localStorage.removeItem(this.SHOPS_KEY);
    localStorage.removeItem(this.ORDERS_KEY);
    localStorage.removeItem(this.CATEGORIES_KEY);
    this.initializeData();
  }
}
