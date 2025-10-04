import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Shop } from './shop.service';

export interface ShopUser {
  shop: Shop;
  loginTime: Date;
  isLoggedIn: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentShopSubject = new BehaviorSubject<ShopUser | null>(null);
  public currentShop$ = this.currentShopSubject.asObservable();

  constructor() {
    // Check if there's a saved session
    this.loadSession();
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
    return current?.shop?.id === 0;
  }

  // Check if user is shop
  isShop(): boolean {
    const current = this.currentShopSubject.value;
    return current?.shop?.id !== 0 && current?.shop?.id !== undefined;
  }

  // Check if logged in
  isLoggedIn(): boolean {
    return this.currentShopSubject.value?.isLoggedIn || false;
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
