import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DataService } from './data.service';

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  sku: string;
  image?: string;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private categories: Category[] = [];
  private products: Product[] = [];

  private productsSubject: BehaviorSubject<Product[]>;
  public products$: Observable<Product[]>;

  constructor(private dataService: DataService) {
    // Initialize BehaviorSubject first
    this.productsSubject = new BehaviorSubject<Product[]>([]);
    this.products$ = this.productsSubject.asObservable();
    
    // Load data from localStorage/JSON
    this.loadData();
  }

  private loadData(): void {
    console.log('🔍 ProductService: Waiting for DataService...');
    
    // Wait for DataService to finish loading
    this.dataService.dataReady$.subscribe(ready => {
      if (ready) {
        console.log('✅ DataService is ready, loading products now...');
        this.products = this.dataService.getProducts();
        this.categories = this.dataService.getCategories();
        
        console.log('📊 Products loaded:', this.products.length, 'products');
        console.log('🏷️ Categories loaded:', this.categories.length, 'categories');

        if (this.products.length > 0) {
          console.log('✅ Products found, emitting to subscribers');
          this.productsSubject.next([...this.products]);
        } else {
          console.error('❌ No products found even after DataService ready!');
        }
      }
    });
  }

  private saveData(): void {
    this.dataService.saveProducts(this.products);
  }

  // Get all products
  getAll(): Observable<Product[]> {
    return this.products$;
  }

  // Get product by ID
  getById(id: number): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  // Create new product
  create(product: Omit<Product, 'id'>): Product {
    const newProduct: Product = {
      ...product,
      id: this.generateId()
    };
    this.products.push(newProduct);
    this.productsSubject.next([...this.products]);
    this.saveData();
    return newProduct;
  }

  // Update product
  update(id: number, updates: Partial<Product>): Product | null {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updates };
      this.productsSubject.next([...this.products]);
      this.saveData();
      return this.products[index];
    }
    return null;
  }

  // Delete product
  delete(id: number): boolean {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
      this.productsSubject.next([...this.products]);
      this.saveData();
      return true;
    }
    return false;
  }

  // Search products
  search(query: string): Product[] {
    const lowerQuery = query.toLowerCase();
    return this.products.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery) ||
      p.sku.toLowerCase().includes(lowerQuery)
    );
  }

  // Filter by category
  filterByCategory(category: string): Product[] {
    return this.products.filter(p => p.category === category);
  }

  // Get all categories
  getCategories(): string[] {
    return [...new Set(this.products.map(p => p.category))];
  }

  // Get category list with icons
  getCategoryList(): Category[] {
    return this.categories;
  }

  // Get category by name
  getCategoryByName(name: string): Category | undefined {
    return this.categories.find(c => c.name === name);
  }

  // Generate new ID
  private generateId(): number {
    return this.products.length > 0 
      ? Math.max(...this.products.map(p => p.id)) + 1 
      : 1;
  }

  // Get product count
  getCount(): number {
    return this.products.length;
  }

  // Get total stock
  getTotalStock(): number {
    return this.products.reduce((sum, p) => sum + p.stock, 0);
  }
}
