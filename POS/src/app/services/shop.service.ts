import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { ShopApiService, ShopDto, CreateShopDto, UpdateShopDto } from './shop-api.service';

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

  constructor(private shopApiService: ShopApiService) {
    this.shopsSubject = new BehaviorSubject<Shop[]>([]);
    this.shops$ = this.shopsSubject.asObservable();
    this.loadData();
  }

  private loadData(): void {
    console.log('🏪 ShopService: Loading shops from API...');
    this.shopApiService.getAllShops().subscribe({
      next: (shopsDto) => {
        this.shops = shopsDto.map(this.mapDtoToShop);
        this.shopsSubject.next([...this.shops]);
        console.log('✅ ShopService: Loaded', this.shops.length, 'shops');
      },
      error: (error) => {
        console.error('❌ ShopService: Error loading shops:', error);
        this.shops = [];
        this.shopsSubject.next([]);
      }
    });
  }

  private mapDtoToShop(dto: ShopDto): Shop {
    return {
      id: dto.id,
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      address: dto.address,
      balance: dto.balance,
      contactPerson: dto.contactPerson,
      city: dto.city,
      state: dto.state,
      zipCode: dto.zipCode,
      role: 'Shop',
      isActive: dto.isActive,
      createdDate: new Date(dto.createdAt),
      lastUpdated: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      userId: dto.userId,
      userEmail: dto.userEmail
    };
  }

  private mapShopToUpdateDto(shop: Partial<Shop>): UpdateShopDto {
    const dto: UpdateShopDto = {};
    if (shop.name !== undefined) dto.name = shop.name;
    if (shop.phone !== undefined) dto.phone = shop.phone;
    if (shop.address !== undefined) dto.address = shop.address;
    if (shop.contactPerson !== undefined) dto.contactPerson = shop.contactPerson;
    if (shop.city !== undefined) dto.city = shop.city;
    if (shop.state !== undefined) dto.state = shop.state;
    if (shop.zipCode !== undefined) dto.zipCode = shop.zipCode;
    if (shop.balance !== undefined) dto.balance = shop.balance;
    if (shop.isActive !== undefined) dto.isActive = shop.isActive;
    return dto;
  }

  // Get all shops
  getShops(): Observable<Shop[]> {
    return this.shops$;
  }

  // Refresh shops from API
  refreshShops(): void {
    this.loadData();
  }

  // Get shop by ID
  getShopById(id: number): Observable<Shop> {
    return this.shopApiService.getShopById(id).pipe(
      map(this.mapDtoToShop)
    );
  }

  // Get shop by email
  getShopByEmail(email: string): Observable<Shop> {
    return this.shopApiService.getShopByEmail(email).pipe(
      map(this.mapDtoToShop)
    );
  }

  // Get shop by user ID
  getShopByUserId(userId: number): Observable<Shop> {
    return this.shopApiService.getShopByUserId(userId).pipe(
      map(this.mapDtoToShop)
    );
  }

  // Add new shop
  addShop(shop: { name: string; email: string; phone: string; address: string; balance: number; contactPerson?: string; city?: string; state?: string; zipCode?: string; password: string }): Observable<Shop> {
    const createDto: CreateShopDto = {
      name: shop.name,
      email: shop.email,
      phone: shop.phone,
      address: shop.address,
      contactPerson: shop.contactPerson || '',
      city: shop.city || '',
      state: shop.state || '',
      zipCode: shop.zipCode || '',
      balance: shop.balance,
      password: shop.password
    };

    return this.shopApiService.createShop(createDto).pipe(
      tap(() => this.loadData()),
      map(this.mapDtoToShop)
    );
  }

  // Update shop
  updateShop(id: number, updates: Partial<Shop>): Observable<Shop> {
    const updateDto = this.mapShopToUpdateDto(updates);
    return this.shopApiService.updateShop(id, updateDto).pipe(
      tap(() => this.loadData()),
      map(this.mapDtoToShop)
    );
  }

  // Delete shop
  deleteShop(id: number): Observable<boolean> {
    return this.shopApiService.deleteShop(id).pipe(
      tap(() => this.loadData()),
      map(() => true)
    );
  }

  // Update shop balance
  updateBalance(id: number, amount: number): Observable<boolean> {
    return this.shopApiService.updateBalance(id, amount).pipe(
      tap(() => this.loadData()),
      map(() => true)
    );
  }

  // Get total balance across all shops
  getTotalBalance(): number {
    return this.shops.reduce((sum, shop) => sum + shop.balance, 0);
  }

  // Get cached shops
  getCachedShops(): Shop[] {
    return [...this.shops];
  }
}
