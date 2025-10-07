import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { DataService } from './data.service';

export interface Shop {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  balance: number;
  contactPerson?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  role?: string;
  isActive?: boolean;
  createdDate?: Date;
  lastUpdated?: Date;
  userId?: number;
  userEmail?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private shops: Shop[] = [];
  private shopsSubject: BehaviorSubject<Shop[]>;
  shops$: Observable<Shop[]>;

  constructor(private dataService: DataService) {
    this.shopsSubject = new BehaviorSubject<Shop[]>([]);
    this.shops$ = this.shopsSubject.asObservable();
    this.loadData();
  }

  private loadData(): void {
    console.log('🏪 ShopService: Loading shops from localStorage...');
    this.shops = this.dataService.getShops().map(this.mapJsonToShop);
    this.shopsSubject.next([...this.shops]);
    console.log('✅ ShopService: Loaded', this.shops.length, 'shops');
  }

  private mapJsonToShop(json: any): Shop {
    return {
      id: json.id,
      name: json.name,
      email: json.email,
      phone: json.phone,
      address: json.address,
      balance: json.balance || 0,
      contactPerson: json.contactPerson || '',
      city: json.city || '',
      state: json.state || '',
      zipCode: json.zipCode || '',
      role: json.role || 'Shop',
      isActive: json.isActive !== undefined ? json.isActive : true,
      createdDate: json.createdDate ? new Date(json.createdDate) : new Date(),
      lastUpdated: json.lastUpdated ? new Date(json.lastUpdated) : new Date(),
      userId: json.userId,
      userEmail: json.userEmail
    };
  }

  private mapShopToJson(shop: Shop): any {
    return {
      id: shop.id,
      name: shop.name,
      email: shop.email,
      phone: shop.phone,
      address: shop.address,
      balance: shop.balance,
      contactPerson: shop.contactPerson || '',
      city: shop.city || '',
      state: shop.state || '',
      zipCode: shop.zipCode || '',
      role: shop.role || 'Shop',
      isActive: shop.isActive !== undefined ? shop.isActive : true,
      createdDate: shop.createdDate || new Date(),
      lastUpdated: shop.lastUpdated || new Date(),
      userId: shop.userId,
      userEmail: shop.userEmail
    };
  }

  // Get all shops
  getShops(): Observable<Shop[]> {
    return this.shops$;
  }

  // Refresh shops from localStorage
  refreshShops(): void {
    this.loadData();
  }

  // Get shop by ID
  getShopById(id: number): Observable<Shop> {
    const shop = this.shops.find(s => s.id === id);
    return shop ? of(shop) : of(null as any);
  }

  // Get shop by email
  getShopByEmail(email: string): Observable<Shop> {
    const shop = this.shops.find(s => s.email === email);
    return shop ? of(shop) : of(null as any);
  }

  // Get shop by user ID
  getShopByUserId(userId: number): Observable<Shop> {
    const shop = this.shops.find(s => s.userId === userId);
    return shop ? of(shop) : of(null as any);
  }

  // Add new shop
  addShop(shop: { name: string; email: string; phone: string; address: string; balance: number; contactPerson?: string; city?: string; state?: string; zipCode?: string; password: string }): Observable<Shop> {
    // Generate new ID
    const maxId = this.shops.length > 0 ? Math.max(...this.shops.map(s => s.id)) : 0;
    const newShop: Shop = {
      id: maxId + 1,
      name: shop.name,
      email: shop.email,
      phone: shop.phone,
      address: shop.address,
      balance: shop.balance,
      contactPerson: shop.contactPerson || '',
      city: shop.city || '',
      state: shop.state || '',
      zipCode: shop.zipCode || '',
      role: 'Shop',
      isActive: true,
      createdDate: new Date(),
      lastUpdated: new Date()
    };

    // Add to array and save to localStorage
    this.shops.push(newShop);
    this.saveShops();
    this.shopsSubject.next([...this.shops]);

    console.log('✅ ShopService: Created new shop:', newShop.name);
    return of(newShop);
  }

  // Update shop
  updateShop(id: number, updates: Partial<Shop>): Observable<Shop> {
    const shopIndex = this.shops.findIndex(s => s.id === id);
    if (shopIndex === -1) {
      return of(null as any);
    }

    // Update the shop
    const updatedShop = {
      ...this.shops[shopIndex],
      ...updates,
      lastUpdated: new Date()
    };

    this.shops[shopIndex] = updatedShop;
    this.saveShops();
    this.shopsSubject.next([...this.shops]);

    console.log('✅ ShopService: Updated shop:', updatedShop.name);
    return of(updatedShop);
  }

  // Delete shop
  deleteShop(id: number): Observable<boolean> {
    const shopIndex = this.shops.findIndex(s => s.id === id);
    if (shopIndex === -1) {
      return of(false);
    }

    this.shops.splice(shopIndex, 1);
    this.saveShops();
    this.shopsSubject.next([...this.shops]);

    console.log('✅ ShopService: Deleted shop with ID:', id);
    return of(true);
  }

  // Update shop balance
  updateBalance(id: number, amount: number): Observable<boolean> {
    const shop = this.shops.find(s => s.id === id);
    if (!shop) {
      return of(false);
    }

    shop.balance = amount;
    shop.lastUpdated = new Date();
    this.saveShops();
    this.shopsSubject.next([...this.shops]);

    console.log('✅ ShopService: Updated balance for shop:', shop.name, 'to', amount);
    return of(true);
  }

  // Get total balance across all shops
  getTotalBalance(): number {
    return this.shops.reduce((sum, shop) => sum + shop.balance, 0);
  }

  // Get cached shops
  getCachedShops(): Shop[] {
    return [...this.shops];
  }

  // Private method to save shops to localStorage
  private saveShops(): void {
    const shopsJson = this.shops.map(shop => this.mapShopToJson(shop));
    this.dataService.saveShops(shopsJson);
  }
}
