import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Order, OrderService } from '../services/order.service';
import { AuthService } from '../services/auth.service';
import { HeaderComponent } from '../components/header/header.component';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-orders',
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  paginatedOrders: Order[] = [];
  
  selectedOrder: Order | null = null;
  showViewModal = false;
  
  // Filters
  searchTerm = '';
  statusFilter = 'all';
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  pages: number[] = [];
  
  // Current shop
  currentShopId: number = 0;
  currentShopName: string = '';
  isAdmin = false;
  
  // Stats
  stats = {
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    cancelled: 0,
    totalRevenue: 0,
    averageOrderValue: 0
  };
  
  Math = Math;

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit() {
    // Check authentication
    const currentUser = this.authService.getCurrentShop();
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.isAdmin = this.authService.isAdmin();
    this.currentShopId = currentUser.shop.id;
    this.currentShopName = currentUser.shop.name;
    
    this.loadOrders();
  }

  loadOrders() {
    if (this.isAdmin) {
      // Admin sees all orders
      this.orderService.getOrders().subscribe(orders => {
        this.orders = orders;
        this.stats = this.orderService.getOrderStats();
        this.applyFilters();
      });
    } else {
      // Shop sees only their orders
      this.orderService.getOrdersByShopId(this.currentShopId).subscribe(orders => {
        this.orders = orders;
        this.stats = this.orderService.getOrderStats(this.currentShopId);
        this.applyFilters();
      });
    }
  }

  applyFilters() {
    // Apply search and status filters
    this.filteredOrders = this.orders.filter(order => {
      const matchesSearch = 
        order.orderNumber.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.customerPhone.includes(this.searchTerm);
      
      const matchesStatus = this.statusFilter === 'all' || order.status === this.statusFilter;
      
      return matchesSearch && matchesStatus;
    });
    
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredOrders.length / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }
    
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedOrders = this.filteredOrders.slice(startIndex, endIndex);
  }

  onSearch() {
    this.currentPage = 1;
    this.applyFilters();
  }

  onStatusFilterChange() {
    this.currentPage = 1;
    this.applyFilters();
  }

  onItemsPerPageChange() {
    this.currentPage = 1;
    this.updatePagination();
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  openViewModal(order: Order) {
    this.selectedOrder = order;
    this.showViewModal = true;
  }

  closeModal() {
    this.showViewModal = false;
    this.selectedOrder = null;
  }

  updateOrderStatus(order: Order, status: Order['status']) {
    this.orderService.updateOrderStatus(order.id, status);
    this.alertService.success('Status Updated', `Order ${order.orderNumber} status changed to ${status}`);
    this.loadOrders();
  }

  cancelOrder(order: Order) {
    if (confirm(`Are you sure you want to cancel order ${order.orderNumber}?`)) {
      this.updateOrderStatus(order, 'cancelled');
    }
  }

  createNewOrder() {
    this.router.navigate(['/create-order']);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'processing': return 'status-processing';
      case 'pending': return 'status-pending';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  printBill(order: Order) {
    // Create a new window for printing
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    if (printWindow) {
      const billHTML = this.generateBillHTML(order);
      printWindow.document.write(billHTML);
      printWindow.document.close();
      
      // Wait for content to load then print
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      };
    }
  }

  private generateBillHTML(order: Order): string {
    const itemsRows = order.items.map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.productName}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${this.formatCurrency(item.price)}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right; font-weight: 600;">${this.formatCurrency(item.total)}</td>
      </tr>
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${order.orderNumber}</title>
        <style>
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
            color: #333;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #f6a623;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 32px;
            font-weight: bold;
            color: #f6a623;
            margin-bottom: 5px;
          }
          .company-info {
            color: #666;
            font-size: 14px;
          }
          .invoice-details {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
          }
          .detail-section {
            flex: 1;
          }
          .detail-section h3 {
            margin: 0 0 10px 0;
            font-size: 14px;
            color: #f6a623;
            text-transform: uppercase;
          }
          .detail-section p {
            margin: 5px 0;
            font-size: 14px;
          }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          .items-table thead {
            background: #f6a623;
            color: white;
          }
          .items-table th {
            padding: 12px 8px;
            text-align: left;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 12px;
          }
          .items-table th:nth-child(2),
          .items-table th:nth-child(3),
          .items-table th:nth-child(4) {
            text-align: right;
          }
          .summary {
            max-width: 300px;
            margin-left: auto;
            border-top: 2px solid #f6a623;
            padding-top: 15px;
          }
          .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 14px;
          }
          .summary-total {
            font-size: 18px;
            font-weight: bold;
            color: #28a745;
            border-top: 2px solid #28a745;
            padding-top: 15px;
            margin-top: 10px;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #eee;
            color: #666;
            font-size: 12px;
          }
          .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
          }
          .status-completed { background: #d4edda; color: #155724; }
          .status-processing { background: #d1ecf1; color: #0c5460; }
          .status-pending { background: #fff3cd; color: #856404; }
          .status-cancelled { background: #f8d7da; color: #721c24; }
          .print-button {
            background: #f6a623;
            color: white;
            border: none;
            padding: 10px 20px;
            font-size: 14px;
            border-radius: 5px;
            cursor: pointer;
            margin: 20px auto;
            display: block;
          }
          .print-button:hover {
            background: #e09518;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">🏪 ${order.shopName}</div>
          <div class="company-info">
            <p>Point of Sale System</p>
            <p>Invoice / Receipt</p>
          </div>
        </div>

        <div class="invoice-details">
          <div class="detail-section">
            <h3>Invoice Details</h3>
            <p><strong>Invoice #:</strong> ${order.orderNumber}</p>
            <p><strong>Date:</strong> ${this.formatDate(order.createdDate)}</p>
            <p><strong>Status:</strong> <span class="status-badge status-${order.status}">${order.status.toUpperCase()}</span></p>
          </div>
          <div class="detail-section">
            <h3>Customer Information</h3>
            <p><strong>Name:</strong> ${order.customerName}</p>
            <p><strong>Phone:</strong> ${order.customerPhone}</p>
            <p><strong>Payment:</strong> ${order.paymentMethod}</p>
          </div>
        </div>

        ${order.notes ? `
        <div style="background: #fff3cd; padding: 12px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #f6a623;">
          <strong>Notes:</strong> ${order.notes}
        </div>
        ` : ''}

        <table class="items-table">
          <thead>
            <tr>
              <th>Product</th>
              <th style="text-align: center;">Quantity</th>
              <th style="text-align: right;">Price</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>

        <div class="summary">
          <div class="summary-row">
            <span>Subtotal:</span>
            <span>${this.formatCurrency(order.subtotal)}</span>
          </div>
          <div class="summary-row">
            <span>Tax (10%):</span>
            <span>${this.formatCurrency(order.tax)}</span>
          </div>
          ${order.discount > 0 ? `
          <div class="summary-row" style="color: #dc3545;">
            <span>Discount:</span>
            <span>-${this.formatCurrency(order.discount)}</span>
          </div>
          ` : ''}
          <div class="summary-row summary-total">
            <span>TOTAL:</span>
            <span>${this.formatCurrency(order.total)}</span>
          </div>
        </div>

        ${order.completedDate ? `
        <div style="text-align: center; margin-top: 20px; color: #28a745; font-weight: 600;">
          ✓ Completed on ${this.formatDate(order.completedDate)}
        </div>
        ` : ''}

        <div class="footer">
          <p><strong>Thank you for your business!</strong></p>
          <p>This is a computer-generated invoice and does not require a signature.</p>
          <p>For any queries, please contact us with your invoice number.</p>
        </div>

        <button class="print-button no-print" onclick="window.print()">Print Invoice</button>
      </body>
      </html>
    `;
  }
}
