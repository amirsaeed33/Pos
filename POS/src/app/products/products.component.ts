import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product, Category } from '../services/product.service';
import { AlertService } from '../services/alert.service';
import { LoaderService } from '../services/loader.service';
import { HeaderComponent } from '../components/header/header.component';

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  paginatedProducts: Product[] = [];
  categoryList: Category[] = [];
  categories: string[] = [];
  searchQuery = '';
  selectedCategory = 'All';
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  pages: number[] = [];
  
  // Make Math available in template
  Math = Math;
  
  // Modal state
  showModal = false;
  modalMode: 'create' | 'edit' | 'view' = 'create';
  selectedProduct: Product | null = null;
  
  // Form data
  productForm: Omit<Product, 'id'> = {
    name: '',
    category: '',
    price: 0,
    stock: 0,
    sku: '',
    description: '',
    image: '📦'
  };

  constructor(
    private productService: ProductService,
    private alertService: AlertService,
    private loaderService: LoaderService
  ) {}

  ngOnInit() {
    console.log('🎯 ProductsComponent: Initializing...');
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    console.log('📥 ProductsComponent: Subscribing to products...');
    this.productService.getAll().subscribe(products => {
      console.log('📦 ProductsComponent: Received products:', products.length, 'products');
      console.log('Products data:', products);
      this.products = products;
      this.applyFilters();
      console.log('✅ Filtered products:', this.filteredProducts.length);
      console.log('📄 Paginated products:', this.paginatedProducts.length);
    });
  }

  loadCategories() {
    this.categoryList = this.productService.getCategoryList();
    this.categories = this.productService.getCategories();
  }

  applyFilters() {
    let filtered = [...this.products];

    // Apply category filter
    if (this.selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }

    // Apply search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query)
      );
    }

    this.filteredProducts = filtered;
    this.currentPage = 1; // Reset to first page on filter change
    this.updatePagination();
  }

  updatePagination() {
    // Calculate total pages
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    
    // Get current page items
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
    
    // Generate page numbers
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
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

  onItemsPerPageChange() {
    this.currentPage = 1;
    this.updatePagination();
  }

  onSearch() {
    this.applyFilters();
  }

  onCategoryChange() {
    this.applyFilters();
  }

  openCreateModal() {
    this.modalMode = 'create';
    this.resetForm();
    this.showModal = true;
  }

  openEditModal(product: Product) {
    this.modalMode = 'edit';
    this.selectedProduct = product;
    this.productForm = {
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      sku: product.sku,
      description: product.description,
      image: product.image || '📦'
    };
    this.showModal = true;
  }

  openViewModal(product: Product) {
    this.modalMode = 'view';
    this.selectedProduct = product;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedProduct = null;
    this.resetForm();
  }

  resetForm() {
    this.productForm = {
      name: '',
      category: '',
      price: 0,
      stock: 0,
      sku: '',
      description: '',
      image: '📦'
    };
  }

  onSubmit() {
    if (this.modalMode === 'create') {
      this.createProduct();
    } else if (this.modalMode === 'edit') {
      this.updateProduct();
    }
  }

  createProduct() {
    this.loaderService.show('Creating product...');
    
    setTimeout(() => {
      const newProduct = this.productService.create(this.productForm);
      this.loaderService.hide();
      this.alertService.success(
        'Product Created!',
        `${newProduct.name} has been added successfully.`
      );
      this.closeModal();
      this.loadCategories();
    }, 1000);
  }

  updateProduct() {
    if (!this.selectedProduct) return;
    
    this.loaderService.show('Updating product...');
    
    setTimeout(() => {
      const updated = this.productService.update(this.selectedProduct!.id, this.productForm);
      this.loaderService.hide();
      
      if (updated) {
        this.alertService.success(
          'Product Updated!',
          `${updated.name} has been updated successfully.`
        );
        this.closeModal();
        this.loadCategories();
      }
    }, 1000);
  }

  deleteProduct(product: Product) {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      this.loaderService.show('Deleting product...');
      
      setTimeout(() => {
        const deleted = this.productService.delete(product.id);
        this.loaderService.hide();
        
        if (deleted) {
          this.alertService.success(
            'Product Deleted!',
            `${product.name} has been removed successfully.`
          );
          this.loadCategories();
        }
      }, 800);
    }
  }

  getLowStockCount(): number {
    return this.products.filter(p => p.stock < 20).length;
  }
}
