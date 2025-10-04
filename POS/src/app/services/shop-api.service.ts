import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ShopDto {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  balance: number;
  contactPerson: string;
  city: string;
  state: string;
  zipCode: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
  userId?: number;
  userEmail?: string;
}

export interface CreateShopDto {
  name: string;
  email: string;
  phone: string;
  address: string;
  contactPerson: string;
  city: string;
  state: string;
  zipCode: string;
  balance: number;
  password: string;
}

export interface UpdateShopDto {
  name?: string;
  phone?: string;
  address?: string;
  contactPerson?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  balance?: number;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ShopApiService {
  private apiUrl = `${environment.apiUrl}/shops`;
  private shopsSubject = new BehaviorSubject<ShopDto[]>([]);
  public shops$ = this.shopsSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Get all active shops
   */
  getAllShops(): Observable<ShopDto[]> {
    return this.http.get<ShopDto[]>(this.apiUrl).pipe(
      tap(shops => {
        console.log('Shops loaded from API:', shops.length);
        this.shopsSubject.next(shops);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Get shop by ID
   */
  getShopById(id: number): Observable<ShopDto> {
    return this.http.get<ShopDto>(`${this.apiUrl}/${id}`).pipe(
      tap(shop => console.log('Shop loaded:', shop.name)),
      catchError(this.handleError)
    );
  }

  /**
   * Get shop by email
   */
  getShopByEmail(email: string): Observable<ShopDto> {
    return this.http.get<ShopDto>(`${this.apiUrl}/email/${encodeURIComponent(email)}`).pipe(
      tap(shop => console.log('Shop loaded by email:', shop.name)),
      catchError(this.handleError)
    );
  }

  /**
   * Get shop by user ID
   */
  getShopByUserId(userId: number): Observable<ShopDto> {
    return this.http.get<ShopDto>(`${this.apiUrl}/user/${userId}`).pipe(
      tap(shop => console.log('Shop loaded by user ID:', shop.name)),
      catchError(this.handleError)
    );
  }

  /**
   * Create a new shop (with user account)
   */
  createShop(shop: CreateShopDto): Observable<ShopDto> {
    return this.http.post<ShopDto>(this.apiUrl, shop).pipe(
      tap(newShop => {
        console.log('Shop created:', newShop.name);
        // Refresh shops list
        this.refreshShops();
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Update an existing shop
   */
  updateShop(id: number, shop: UpdateShopDto): Observable<ShopDto> {
    return this.http.put<ShopDto>(`${this.apiUrl}/${id}`, shop).pipe(
      tap(updatedShop => {
        console.log('Shop updated:', updatedShop.name);
        // Refresh shops list
        this.refreshShops();
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Delete a shop (soft delete)
   */
  deleteShop(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        console.log('Shop deleted:', id);
        // Refresh shops list
        this.refreshShops();
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Update shop balance
   */
  updateBalance(id: number, amount: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/balance`, amount).pipe(
      tap(() => {
        console.log('Shop balance updated:', id, amount);
        // Refresh shops list
        this.refreshShops();
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Get cached shops
   */
  getCachedShops(): ShopDto[] {
    return this.shopsSubject.value;
  }

  /**
   * Refresh shops list
   */
  private refreshShops(): void {
    this.getAllShops().subscribe();
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
    
    console.error('ShopApiService Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}

