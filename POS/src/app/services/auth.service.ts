import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Shop } from './shop.service';
import { environment } from '../../environments/environment';

export interface ShopUser {
  shop: Shop;
  loginTime: Date;
  isLoggedIn: boolean;
  token?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentShopSubject = new BehaviorSubject<ShopUser | null>(null);
  public currentShop$ = this.currentShopSubject.asObservable();
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {
    // Check if there's a saved session
    this.loadSession();
  }

  // API-based login with fallback to local authentication
  login(email: string, password: string): Observable<LoginResponse> {
    // Check if API authentication is disabled in environment
    if (!environment.useApiAuth) {
      return this.localLogin(email, password);
    }

    const request: LoginRequest = { email, password };
    
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request).pipe(
      map((response) => {
        console.log('AuthService - API Response:', response);
        
        if (response.success && response.user && response.token) {
          // Create ShopUser from API response
          const shopUser: ShopUser = {
            shop: {
              id: response.user.id,
              name: response.user.name,
              email: response.user.email,
              phone: '',
              address: '',
              balance: 0,
              role: response.user.role,  // Store the role!
              createdDate: new Date(),
              lastUpdated: new Date()
            },
            loginTime: new Date(),
            isLoggedIn: true,
            token: response.token
          };
          
          console.log('AuthService - Saving ShopUser with role:', shopUser.shop.role);
          
          // Save to state and localStorage
          this.currentShopSubject.next(shopUser);
          this.saveSession(shopUser);
        }
        return response;
      }),
      catchError((error) => {
        console.log('API authentication failed, falling back to local authentication:', error.message);
        // Fallback to local authentication
        return this.localLogin(email, password);
      })
    );
  }

  // Local authentication fallback
  private localLogin(email: string, password: string): Observable<LoginResponse> {
    console.log('AuthService - Using local authentication');
    
    // Check admin credentials
    if (email === 'admin@cxp.com' && password === 'Admin123!') {
      const shopUser: ShopUser = {
        shop: {
          id: 0,
          name: 'Admin',
          email: email,
          phone: '',
          address: '',
          balance: 0,
          role: 'admin',
          createdDate: new Date(),
          lastUpdated: new Date()
        },
        loginTime: new Date(),
        isLoggedIn: true,
        token: 'local-admin-token'
      };
      
      this.currentShopSubject.next(shopUser);
      this.saveSession(shopUser);
      
      return new Observable(observer => {
        observer.next({
          success: true,
          message: 'Login successful',
          user: {
            id: 0,
            name: 'Admin',
            email: email,
            role: 'admin'
          },
          token: 'local-admin-token'
        });
        observer.complete();
      });
    }
    
    // Check shop credentials (you can add more shop credentials here)
    if (password === 'shop123') {
      const shopUser: ShopUser = {
        shop: {
          id: 1,
          name: 'Demo Shop',
          email: email,
          phone: '',
          address: '',
          balance: 0,
          role: 'shop',
          createdDate: new Date(),
          lastUpdated: new Date()
        },
        loginTime: new Date(),
        isLoggedIn: true,
        token: 'local-shop-token'
      };
      
      this.currentShopSubject.next(shopUser);
      this.saveSession(shopUser);
      
      return new Observable(observer => {
        observer.next({
          success: true,
          message: 'Login successful',
          user: {
            id: 1,
            name: 'Demo Shop',
            email: email,
            role: 'shop'
          },
          token: 'local-shop-token'
        });
        observer.complete();
      });
    }
    
    // Invalid credentials
    return new Observable(observer => {
      observer.error(new Error('Invalid email or password'));
    });
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred during login';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = error.error?.message || `Server returned code ${error.status}`;
    }
    
    console.error('Login error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  // Login with shop credentials
  loginAsShop(email: string, password: string, shops: Shop[]): ShopUser | null {
    // Find shop by email
    debugger;
    const shop = shops.find(s => s.email.toLowerCase() === email.toLowerCase());
    
    if (shop) {
      // For demo, we'll use simple password: "shop123" for all shops
      // In production, use proper authentication
      if (password === 'shop123') {
        const shopUser: ShopUser = {
          shop: shop,
          loginTime: new Date(),
          isLoggedIn: true
        };
        
        this.currentShopSubject.next(shopUser);
        this.saveSession(shopUser);
        return shopUser;
      }
    }
    
    return null;
  }

  // Admin login (existing login)
  loginAsAdmin(username: string, password: string): boolean {
    if (username === 'admin@cxp.com' && password === 'Admin123!') {
      const adminUser: ShopUser = {
        shop: {
          id: 0,
          name: 'Admin',
          email: username,
          phone: '',
          address: '',
          balance: 0,
          createdDate: new Date(),
          lastUpdated: new Date()
        },
        loginTime: new Date(),
        isLoggedIn: true
      };
      
      this.currentShopSubject.next(adminUser);
      this.saveSession(adminUser);
      return true;
    }
    return false;
  }

  // Logout
  logout(): void {
    this.currentShopSubject.next(null);
    localStorage.removeItem('currentShop');
  }

  // Get current logged in shop
  getCurrentShop(): ShopUser | null {
    return this.currentShopSubject.value;
  }

  // Check if user is admin
  isAdmin(): boolean {
    const current = this.currentShopSubject.value;
    // Check by role first, fallback to ID check
    return current?.shop?.role?.toLowerCase() === 'admin' || current?.shop?.id === 0;
  }

  // Check if user is shop
  isShop(): boolean {
    const current = this.currentShopSubject.value;
    // Check by role first, fallback to ID check
    return current?.shop?.role?.toLowerCase() === 'shop' || 
           (current?.shop?.id !== 0 && current?.shop?.id !== undefined);
  }

  // Check if logged in
  isLoggedIn(): boolean {
    return this.currentShopSubject.value?.isLoggedIn || false;
  }

  // Get authentication token
  getToken(): string | null {
    return this.currentShopSubject.value?.token || null;
  }

  // Get current user role
  getUserRole(): string | null {
    return this.currentShopSubject.value?.shop?.role || null;
  }

  // Save session to localStorage
  private saveSession(shopUser: ShopUser): void {
    localStorage.setItem('currentShop', JSON.stringify(shopUser));
  }

  // Load session from localStorage
  private loadSession(): void {
    const saved = localStorage.getItem('currentShop');
    if (saved) {
      try {
        const shopUser: ShopUser = JSON.parse(saved);
        // Convert date strings back to Date objects
        shopUser.loginTime = new Date(shopUser.loginTime);
        if (shopUser.shop.createdDate) {
          shopUser.shop.createdDate = new Date(shopUser.shop.createdDate);
        }
        if (shopUser.shop.lastUpdated) {
          shopUser.shop.lastUpdated = new Date(shopUser.shop.lastUpdated);
        }
        this.currentShopSubject.next(shopUser);
      } catch (e) {
        console.error('Error loading session', e);
      }
    }
  }
}
