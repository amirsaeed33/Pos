import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  sku: string;
  description: string;
  image: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateProductDto {
  name: string;
  category: string;
  price: number;
  stock: number;
  sku: string;
  description: string;
  image: string;
}

export interface UpdateProductDto {
  name?: string;
  category?: string;
  price?: number;
  stock?: number;
  description?: string;
  image?: string;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Get all active products
   */
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      tap(products => {
        console.log('Products loaded from API:', products.length);
        this.productsSubject.next(products);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Get products by category
   */
  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/category/${encodeURIComponent(category)}`).pipe(
      tap(products => console.log(`Products in category ${category}:`, products.length)),
      catchError(this.handleError)
    );
  }

  /**
   * Get all unique categories
   */
  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`).pipe(
      tap(categories => console.log('Categories loaded:', categories)),
      catchError(this.handleError)
    );
  }

  /**
   * Get product by ID
   */
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      tap(product => console.log('Product loaded:', product.name)),
      catchError(this.handleError)
    );
  }

  /**
   * Get product by SKU
   */
  getProductBySku(sku: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/sku/${encodeURIComponent(sku)}`).pipe(
      tap(product => console.log('Product loaded by SKU:', product.name)),
      catchError(this.handleError)
    );
  }

  /**
   * Create a new product
   */
  createProduct(product: CreateProductDto): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product).pipe(
      tap(newProduct => {
        console.log('Product created:', newProduct.name);
        // Refresh products list
        this.refreshProducts();
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Update an existing product
   */
  updateProduct(id: number, product: UpdateProductDto): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product).pipe(
      tap(updatedProduct => {
        console.log('Product updated:', updatedProduct.name);
        // Refresh products list
        this.refreshProducts();
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Delete a product (soft delete)
   */
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        console.log('Product deleted:', id);
        // Refresh products list
        this.refreshProducts();
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Search products by name
   */
  searchProducts(searchTerm: string): Product[] {
    const products = this.productsSubject.value;
    if (!searchTerm) {
      return products;
    }
    
    const term = searchTerm.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      product.sku.toLowerCase().includes(term)
    );
  }

  /**
   * Filter products by category
   */
  filterByCategory(category: string): Product[] {
    const products = this.productsSubject.value;
    if (!category || category === 'All') {
      return products;
    }
    return products.filter(product => product.category === category);
  }

  /**
   * Get cached products
   */
  getCachedProducts(): Product[] {
    return this.productsSubject.value;
  }

  /**
   * Refresh products list
   */
  private refreshProducts(): void {
    this.getAllProducts().subscribe();
  }

  /**
   * Error handler
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = error.error?.message || `Server returned code ${error.status}: ${error.message}`;
    }
    
    console.error('ProductService Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
