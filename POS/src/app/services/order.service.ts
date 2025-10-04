import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataService } from './data.service';

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  shopId: number;
  shopName: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  paymentMethod: string;
  customerName: string;
  customerPhone: string;
  notes: string;
  createdDate: Date;
  completedDate?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orders: Order[] = [];
  private ordersSubject: BehaviorSubject<Order[]>;
  orders$: Observable<Order[]>;

  constructor(private dataService: DataService) {
    this.ordersSubject = new BehaviorSubject<Order[]>([]);
    this.orders$ = this.ordersSubject.asObservable();
    this.loadData();
  }

  private loadData(): void {
    const ordersData = this.dataService.getOrders();
    
    if (ordersData.length > 0) {
      // Convert date strings back to Date objects
      this.orders = ordersData.map(order => ({
        ...order,
        createdDate: new Date(order.createdDate),
        completedDate: order.completedDate ? new Date(order.completedDate) : undefined
      }));
      this.ordersSubject.next([...this.orders]);
    } else {
      setTimeout(() => {
        const ordersData = this.dataService.getOrders();
        this.orders = ordersData.map(order => ({
          ...order,
          createdDate: new Date(order.createdDate),
          completedDate: order.completedDate ? new Date(order.completedDate) : undefined
        }));
        this.ordersSubject.next([...this.orders]);
      }, 500);
    }
  }

  private saveData(): void {
    this.dataService.saveOrders(this.orders);
  }

  // Get all orders
  getOrders(): Observable<Order[]> {
    return this.orders$;
  }

  // Get orders by shop ID
  getOrdersByShopId(shopId: number): Observable<Order[]> {
    return this.orders$.pipe(
      map(orders => orders.filter(order => order.shopId === shopId))
    );
  }

  // Create new order
  createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdDate'>): Order {
    const id = this.generateId();
    const orderNumber = this.generateOrderNumber(id);
    
    const newOrder: Order = {
      ...orderData,
      id,
      orderNumber,
      createdDate: new Date(),
      status: orderData.status || 'pending'
    };
    
    this.orders.push(newOrder);
    this.ordersSubject.next([...this.orders]);
    this.saveData();
    return newOrder;
  }

  // Update order status
  updateOrderStatus(orderId: number, status: Order['status']): Order | null {
    const index = this.orders.findIndex(o => o.id === orderId);
    if (index !== -1) {
      this.orders[index] = {
        ...this.orders[index],
        status,
        completedDate: status === 'completed' ? new Date() : this.orders[index].completedDate
      };
      this.ordersSubject.next([...this.orders]);
      this.saveData();
      return this.orders[index];
    }
    return null;
  }

  // Delete order
  deleteOrder(orderId: number): boolean {
    const index = this.orders.findIndex(o => o.id === orderId);
    if (index !== -1) {
      this.orders.splice(index, 1);
      this.ordersSubject.next([...this.orders]);
      this.saveData();
      return true;
    }
    return false;
  }

  // Generate new ID
  private generateId(): number {
    return this.orders.length > 0 
      ? Math.max(...this.orders.map(o => o.id)) + 1 
      : 1;
  }

  // Generate order number
  private generateOrderNumber(id: number): string {
    const year = new Date().getFullYear();
    const paddedId = id.toString().padStart(4, '0');
    return `ORD-${year}-${paddedId}`;
  }

  // Statistics methods
  getTotalOrders(shopId?: number): number {
    if (shopId) {
      return this.orders.filter(o => o.shopId === shopId).length;
    }
    return this.orders.length;
  }

  getOrdersByStatus(status: Order['status'], shopId?: number): number {
    let filtered = this.orders.filter(o => o.status === status);
    if (shopId) {
      filtered = filtered.filter(o => o.shopId === shopId);
    }
    return filtered.length;
  }

  getTotalRevenue(shopId?: number): number {
    let filtered = this.orders.filter(o => o.status === 'completed');
    if (shopId) {
      filtered = filtered.filter(o => o.shopId === shopId);
    }
    return filtered.reduce((sum, order) => sum + order.total, 0);
  }

  getAverageOrderValue(shopId?: number): number {
    const completedOrders = this.orders.filter(o => 
      o.status === 'completed' && (!shopId || o.shopId === shopId)
    );
    if (completedOrders.length === 0) return 0;
    const totalRevenue = this.getTotalRevenue(shopId);
    return totalRevenue / completedOrders.length;
  }

  getOrderStats(shopId?: number) {
    return {
      total: this.getTotalOrders(shopId),
      pending: this.getOrdersByStatus('pending', shopId),
      processing: this.getOrdersByStatus('processing', shopId),
      completed: this.getOrdersByStatus('completed', shopId),
      cancelled: this.getOrdersByStatus('cancelled', shopId),
      totalRevenue: this.getTotalRevenue(shopId),
      averageOrderValue: this.getAverageOrderValue(shopId)
    };
  }
}
