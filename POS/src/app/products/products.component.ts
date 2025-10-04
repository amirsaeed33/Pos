import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product, CreateProductDto, UpdateProductDto } from '../services/product.service';
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
  categories: string[] = ['All']; // Initialize with 'All' by default
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
  productForm: CreateProductDto = {
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
    console.log('📥 ProductsComponent: Loading products from API...');
    this.loaderService.show('Loading products...');
    
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        console.log('📦 ProductsComponent: Received products:', products.length, 'products');
        this.products = products;
        this.applyFilters();
        this.loaderService.hide();
        console.log('✅ Filtered products:', this.filteredProducts.length);
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loaderService.hide();
        this.alertService.error(
          'Error Loading Products',
          'Unable to load products from the server. Please try again.'
        );
      }
    });
  }

  loadCategories() {
    console.log('📂 Loading categories from API...');
    this.productService.getCategories().subscribe({
      next: (categories) => {
        console.log('📂 Categories loaded from API:', categories);
        console.log('📂 Number of categories:', categories.length);
        this.categories = ['All', ...categories];
        console.log('📂 Final categories array:', this.categories);
      },
      error: (error) => {
        console.error('❌ Error loading categories:', error);
        console.error('Error details:', error.message);
        this.categories = ['All'];
        this.alertService.error(
          'Error Loading Categories',
          'Using default category list. Please check if the API is running.'
        );
      }
    });
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

  // Category filter from API
  onCategoryFilter(category: string) {
    if (category === 'All') {
      this.loadProducts();
    } else {
      this.loaderService.show(`Loading ${category} products...`);
      this.productService.getProductsByCategory(category).subscribe({
        next: (products) => {
          console.log(`📦 Products in ${category}:`, products.length);
          this.products = products;
          this.applyFilters();
          this.loaderService.hide();
        },
        error: (error) => {
          console.error('Error loading products by category:', error);
          this.loaderService.hide();
          this.alertService.error(
            'Error',
            'Unable to filter products by category.'
          );
        }
      });
    }
  }

  onSubmit() {
    if (this.modalMode === 'create') {
      this.createProduct();
    } else if (this.modalMode === 'edit') {
      this.updateProduct();
    }
  }

  createProduct() {
    // Validate form
    if (!this.productForm.name || !this.productForm.category || !this.productForm.sku) {
      this.alertService.error(
        'Validation Error',
        'Please fill in all required fields (Name, Category, SKU)'
      );
      return;
    }

    this.loaderService.show('Creating product...');
    
    this.productService.createProduct(this.productForm).subscribe({
      next: (newProduct) => {
        this.loaderService.hide();
        this.alertService.success(
          'Product Created!',
          `${newProduct.name} has been added successfully.`
        );
        this.closeModal();
        this.loadProducts();
        this.loadCategories();
      },
      error: (error) => {
        this.loaderService.hide();
        this.alertService.error(
          'Error Creating Product',
          error.message || 'Unable to create product. Please try again.'
        );
      }
    });
  }

  updateProduct() {
    if (!this.selectedProduct) return;
    
    // Validate form
    if (!this.productForm.name || !this.productForm.category) {
      this.alertService.error(
        'Validation Error',
        'Please fill in all required fields'
      );
      return;
    }

    this.loaderService.show('Updating product...');
    
    const updateDto: UpdateProductDto = {
      name: this.productForm.name,
      category: this.productForm.category,
      price: this.productForm.price,
      stock: this.productForm.stock,
      description: this.productForm.description,
      image: this.productForm.image
    };
    
    this.productService.updateProduct(this.selectedProduct.id, updateDto).subscribe({
      next: (updated) => {
        this.loaderService.hide();
        this.alertService.success(
          'Product Updated!',
          `${updated.name} has been updated successfully.`
        );
        this.closeModal();
        this.loadProducts();
        this.loadCategories();
      },
      error: (error) => {
        this.loaderService.hide();
        this.alertService.error(
          'Error Updating Product',
          error.message || 'Unable to update product. Please try again.'
        );
      }
    });
  }

  deleteProduct(product: Product) {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      this.loaderService.show('Deleting product...');
      
      this.productService.deleteProduct(product.id).subscribe({
        next: () => {
          this.loaderService.hide();
          this.alertService.success(
            'Product Deleted!',
            `${product.name} has been removed successfully.`
          );
          this.loadProducts();
          this.loadCategories();
        },
        error: (error) => {
          this.loaderService.hide();
          this.alertService.error(
            'Error Deleting Product',
            error.message || 'Unable to delete product. Please try again.'
          );
        }
      });
    }
  }

  getLowStockCount(): number {
    return this.products.filter(p => p.stock < 20).length;
  }
}
