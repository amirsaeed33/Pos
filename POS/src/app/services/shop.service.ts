import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DataService } from './data.service';

export interface Shop {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  balance: number;
  createdDate?: Date;
  lastUpdated?: Date;
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
    this.dataService.dataReady$.subscribe(ready => {
      if (ready) {
        const shopsData = this.dataService.getShops();
        // Convert date strings back to Date objects
        this.shops = shopsData.map(shop => ({
          ...shop,
          createdDate: shop.createdDate ? new Date(shop.createdDate) : undefined,
          lastUpdated: shop.lastUpdated ? new Date(shop.lastUpdated) : undefined
        }));
        this.shopsSubject.next([...this.shops]);
      }
    });
  }

  private saveData(): void {
    this.dataService.saveShops(this.shops);
  }

  // Get all shops
  getShops(): Observable<Shop[]> {
    return this.shops$;
  }

  // Get shop by ID
  getShopById(id: number): Shop | undefined {
    return this.shops.find(s => s.id === id);
  }

  // Add new shop
  addShop(shop: Omit<Shop, 'id' | 'createdDate' | 'lastUpdated'>): Shop {
    const newShop: Shop = {
      ...shop,
      id: this.generateId(),
      createdDate: new Date(),
      lastUpdated: new Date()
    };
    this.shops.push(newShop);
    this.shopsSubject.next([...this.shops]);
    this.saveData();
    return newShop;
  }

  // Update shop
  updateShop(id: number, updates: Partial<Shop>): Shop | null {
    const index = this.shops.findIndex(s => s.id === id);
    if (index !== -1) {
      this.shops[index] = {
        ...this.shops[index],
        ...updates,
        lastUpdated: new Date()
      };
      this.shopsSubject.next([...this.shops]);
      this.saveData();
      return this.shops[index];
    }
    return null;
  }

  // Delete shop
  deleteShop(id: number): boolean {
    const index = this.shops.findIndex(s => s.id === id);
    if (index !== -1) {
      this.shops.splice(index, 1);
      this.shopsSubject.next([...this.shops]);
      this.saveData();
      return true;
    }
    return false;
  }

  // Generate new ID
  private generateId(): number {
    return this.shops.length > 0 
      ? Math.max(...this.shops.map(s => s.id)) + 1 
      : 1;
  }

  // Update shop balance
  updateBalance(id: number, amount: number): Shop | null {
    return this.updateShop(id, { balance: amount });
  }

  // Get total balance across all shops
  getTotalBalance(): number {
    return this.shops.reduce((sum, shop) => sum + shop.balance, 0);
  }
}
