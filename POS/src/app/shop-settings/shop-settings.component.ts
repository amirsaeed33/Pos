import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Shop, ShopService } from '../services/shop.service';
import { HeaderComponent } from '../components/header/header.component';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-shop-settings',
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './shop-settings.component.html',
  styleUrl: './shop-settings.component.css'
})
export class ShopSettingsComponent implements OnInit {
  shops: Shop[] = [];
  filteredShops: Shop[] = [];
  paginatedShops: Shop[] = [];
  
  selectedShop: Shop | null = null;
  isEditMode = false;
  showModal = false;
  showViewModal = false;
  
  // Form fields
  shopForm = {
    name: '',
    email: '',
    phone: '',
    address: '',
    balance: 0
  };
  
  // Search and filter
  searchTerm = '';
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  pages: number[] = [];
  
  // Math for template
  Math = Math;

  constructor(
    private shopService: ShopService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.loadShops();
  }

  loadShops() {
    this.shopService.getShops().subscribe(shops => {
      this.shops = shops;
      this.applyFilters();
    });
  }

  applyFilters() {
    // Apply search filter
    this.filteredShops = this.shops.filter(shop =>
      shop.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      shop.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      shop.phone.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      shop.address.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    
    // Update pagination
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredShops.length / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }
    
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedShops = this.filteredShops.slice(startIndex, endIndex);
  }

  onSearch() {
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

  // CRUD Operations
  openCreateModal() {
    this.isEditMode = false;
    this.resetForm();
    this.showModal = true;
  }

  openEditModal(shop: Shop) {
    this.isEditMode = true;
    this.selectedShop = shop;
    this.shopForm = {
      name: shop.name,
      email: shop.email,
      phone: shop.phone,
      address: shop.address,
      balance: shop.balance
    };
    this.showModal = true;
  }

  openViewModal(shop: Shop) {
    this.selectedShop = shop;
    this.showViewModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.showViewModal = false;
    this.resetForm();
  }

  resetForm() {
    this.shopForm = {
      name: '',
      email: '',
      phone: '',
      address: '',
      balance: 0
    };
    this.selectedShop = null;
  }

  saveShop() {
    // Validation
    if (!this.shopForm.name || !this.shopForm.email || !this.shopForm.phone) {
      this.alertService.error('Validation Error', 'Please fill in all required fields.');
      return;
    }

    if (this.isEditMode && this.selectedShop) {
      // Update existing shop
      this.shopService.updateShop(this.selectedShop.id, this.shopForm);
      this.alertService.success('Shop Updated', `${this.shopForm.name} has been updated successfully.`);
    } else {
      // Create new shop
      this.shopService.addShop(this.shopForm);
      this.alertService.success('Shop Created', `${this.shopForm.name} has been created successfully.`);
    }

    this.closeModal();
  }

  deleteShop(shop: Shop) {
    if (confirm(`Are you sure you want to delete ${shop.name}?`)) {
      this.shopService.deleteShop(shop.id);
      this.alertService.info('Shop Deleted', `${shop.name} has been deleted.`);
    }
  }

  // Utility methods
  getTotalBalance(): number {
    return this.shopService.getTotalBalance();
  }

  getAverageBalance(): number {
    if (this.shops.length === 0) return 0;
    return this.getTotalBalance() / this.shops.length;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
