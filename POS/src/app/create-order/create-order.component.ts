import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../components/header/header.component';
import { AlertService } from '../services/alert.service';
import { OrderService, Order, OrderItem } from '../services/order.service';
import { ProductService, Product } from '../services/product.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-create-order',
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './create-order.component.html',
  styleUrl: './create-order.component.css'
})
export class CreateOrderComponent implements OnInit {
  products: Product[] = [];
  orderItems: OrderItem[] = [];
  
  // Form fields
  customerName = '';
  customerPhone = '';
  paymentMethod = 'Cash';
  notes = '';
  
  // Selected product
  selectedProductId: number | null = null;
  quantity = 1;
  
  // Calculations
  subtotal = 0;
  tax = 0;
  discount = 0;
  total = 0;
  
  currentShopId = 0;
  currentShopName = '';

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private authService: AuthService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit() {
    // Check authentication
    const currentUser = this.authService.getCurrentShop();
    if (!currentUser || this.authService.isAdmin()) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.currentShopId = currentUser.shop.id;
    this.currentShopName = currentUser.shop.name;
    
    // Load products
    this.productService.products$.subscribe(products => {
      this.products = products;
    });
  }

  addProduct() {
    console.log('Add button clicked!', {
      selectedProductId: this.selectedProductId,
      quantity: this.quantity,
      products: this.products.length
    });

    if (!this.selectedProductId || this.quantity <= 0) {
      this.alertService.error('Invalid Selection', 'Please select a product and quantity');
      return;
    }
    
    // Convert selectedProductId to number if it's a string
    const productId = typeof this.selectedProductId === 'string' 
      ? parseInt(this.selectedProductId, 10) 
      : this.selectedProductId;
    
    const product = this.products.find(p => p.id === productId);
    console.log('Found product:', product);
    
    if (!product) {
      this.alertService.error('Product Not Found', 'Selected product does not exist');
      return;
    }
    
    // Check stock
    if (product.stock < this.quantity) {
      this.alertService.error('Insufficient Stock', `Only ${product.stock} units available`);
      return;
    }
    
    // Check if product already in cart
    const existingItem = this.orderItems.find(item => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += this.quantity;
      existingItem.total = existingItem.quantity * existingItem.price;
    } else {
      this.orderItems.push({
        productId: product.id,
        productName: product.name,
        quantity: this.quantity,
        price: product.price,
        total: this.quantity * product.price
      });
    }
    
    this.alertService.success('Product Added', `${product.name} added to order`);
    
    // Reset selection
    this.selectedProductId = null;
    this.quantity = 1;
    
    this.calculateTotals();
  }

  removeProduct(index: number) {
    this.orderItems.splice(index, 1);
    this.calculateTotals();
  }

  calculateTotals() {
    this.subtotal = this.orderItems.reduce((sum, item) => sum + item.total, 0);
    this.tax = this.subtotal * 0.1; // 10% tax
    this.total = this.subtotal + this.tax - this.discount;
  }

  createOrder() {
    // Validation
    if (this.orderItems.length === 0) {
      this.alertService.error('Empty Order', 'Please add at least one product');
      return;
    }
    
    if (!this.customerName || !this.customerPhone) {
      this.alertService.error('Missing Information', 'Please enter customer name and phone');
      return;
    }
    
    // Create order object
    const orderData: Omit<Order, 'id' | 'orderNumber' | 'createdDate'> = {
      shopId: this.currentShopId,
      shopName: this.currentShopName,
      items: [...this.orderItems],
      subtotal: this.subtotal,
      tax: this.tax,
      discount: this.discount,
      total: this.total,
      status: 'pending',
      paymentMethod: this.paymentMethod,
      customerName: this.customerName,
      customerPhone: this.customerPhone,
      notes: this.notes
    };
    
    // Create order
    const newOrder = this.orderService.createOrder(orderData);
    
    this.alertService.success('Order Created', `Order ${newOrder.orderNumber} created successfully!`);
    
    setTimeout(() => {
      this.router.navigate(['/orders']);
    }, 1500);
  }

  cancel() {
    if (confirm('Are you sure you want to cancel? All data will be lost.')) {
      this.router.navigate(['/orders']);
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
}
