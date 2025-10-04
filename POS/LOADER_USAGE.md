# ⏳ Loader Service - Usage Guide

## Overview
A beautiful, animated loader component for your POS application with dynamic messages and yellow theme styling.

## Features
- ✅ **Triple Ring Spinner** - Three animated circles in yellow theme
- 🎨 **Gradient Logo** - Shop icon with pulsing animation
- 💬 **Dynamic Messages** - Customizable loading text
- 🔄 **Bouncing Dots** - Animated loading indicators
- 📱 **Responsive** - Works on all screen sizes
- 🎭 **Smooth Animations** - Professional transitions
- 🌐 **Global Service** - Use anywhere in your app

## Visual Design
- **Background**: Dark overlay with blur effect
- **Spinner**: Three rotating circles in yellow/orange gradient
- **Center Logo**: POS shop icon with pulse animation
- **Message Card**: White card with yellow border
- **Loading Dots**: Three bouncing gradient dots

## Installation
Already set up! Just inject the service and use it.

## Usage

### 1. Import the LoaderService
```typescript
import { LoaderService } from './services/loader.service';

export class YourComponent {
  constructor(private loaderService: LoaderService) {}
}
```

### 2. Show Loader
```typescript
// Simple show
this.loaderService.show();

// With custom message
this.loaderService.show('Processing payment...');
```

### 3. Hide Loader
```typescript
this.loaderService.hide();
```

### 4. Update Message While Loading
```typescript
this.loaderService.setMessage('Fetching data...');
```

## Complete Examples

### Login Authentication
```typescript
onLogin() {
  this.loaderService.show('Authenticating...');
  
  this.authService.login(credentials).subscribe({
    next: (response) => {
      this.loaderService.setMessage('Loading profile...');
      
      setTimeout(() => {
        this.loaderService.hide();
        this.router.navigate(['/dashboard']);
      }, 500);
    },
    error: (error) => {
      this.loaderService.hide();
      this.alertService.error('Login Failed', error.message);
    }
  });
}
```

### API Data Fetch
```typescript
loadProducts() {
  this.loaderService.show('Loading products...');
  
  this.productService.getAll().subscribe({
    next: (products) => {
      this.products = products;
      this.loaderService.hide();
    },
    error: (error) => {
      this.loaderService.hide();
      this.alertService.error('Error', 'Failed to load products');
    }
  });
}
```

### Multi-Step Process
```typescript
async processOrder() {
  // Step 1
  this.loaderService.show('Validating order...');
  await this.validateOrder();
  
  // Step 2
  this.loaderService.setMessage('Processing payment...');
  await this.processPayment();
  
  // Step 3
  this.loaderService.setMessage('Generating invoice...');
  await this.generateInvoice();
  
  // Step 4
  this.loaderService.setMessage('Sending confirmation...');
  await this.sendConfirmation();
  
  // Done
  this.loaderService.hide();
  this.alertService.success('Success', 'Order completed!');
}
```

### File Upload
```typescript
uploadFile(file: File) {
  this.loaderService.show('Uploading file...');
  
  this.fileService.upload(file).subscribe({
    next: (progress) => {
      this.loaderService.setMessage(`Uploading... ${progress}%`);
    },
    complete: () => {
      this.loaderService.hide();
      this.alertService.success('Done', 'File uploaded successfully');
    }
  });
}
```

### Form Submission
```typescript
onSubmit() {
  this.loaderService.show('Saving changes...');
  
  this.service.save(this.formData).subscribe({
    next: (result) => {
      this.loaderService.hide();
      this.alertService.success('Saved', 'Changes saved successfully!');
    },
    error: (error) => {
      this.loaderService.hide();
      this.alertService.error('Error', 'Failed to save changes');
    }
  });
}
```

### Delete Operation
```typescript
deleteItem(id: number) {
  this.loaderService.show('Deleting item...');
  
  this.service.delete(id).subscribe({
    next: () => {
      this.loaderService.hide();
      this.alertService.success('Deleted', 'Item removed successfully');
      this.loadItems(); // Refresh list
    },
    error: () => {
      this.loaderService.hide();
      this.alertService.error('Error', 'Failed to delete item');
    }
  });
}
```

### Search Operation
```typescript
onSearch(query: string) {
  this.loaderService.show('Searching...');
  
  this.searchService.search(query).subscribe({
    next: (results) => {
      this.searchResults = results;
      this.loaderService.hide();
    },
    error: () => {
      this.loaderService.hide();
      this.alertService.warning('No Results', 'No items found');
    }
  });
}
```

## Loader Service API

### Methods

#### `show(message?: string)`
Shows the loader with an optional message.
- **Default message**: "Loading..."
- **Example**: `show('Please wait...')`

#### `hide()`
Hides the loader and resets the message.
- **Example**: `hide()`

#### `setMessage(message: string)`
Updates the message while loader is visible.
- **Example**: `setMessage('Almost done...')`

### Observables

#### `loading$: Observable<boolean>`
Subscribe to know when loader is shown/hidden.

#### `message$: Observable<string>`
Subscribe to track message changes.

## Message Examples

### General
- "Loading..."
- "Please wait..."
- "Processing..."
- "Working on it..."

### Authentication
- "Authenticating..."
- "Logging in..."
- "Verifying credentials..."
- "Loading profile..."

### Data Operations
- "Loading data..."
- "Fetching records..."
- "Saving changes..."
- "Updating database..."
- "Deleting item..."

### Payment
- "Processing payment..."
- "Verifying transaction..."
- "Completing purchase..."

### File Operations
- "Uploading file..."
- "Downloading..."
- "Generating report..."
- "Creating PDF..."

## Best Practices

1. **Always hide the loader** - Don't forget to call `hide()` in error handlers
2. **Use meaningful messages** - Help users understand what's happening
3. **Update messages** - For multi-step processes, show progress
4. **Keep it short** - Use concise, clear messages
5. **Error handling** - Always hide loader before showing error alerts
6. **Don't overuse** - Only for operations taking >500ms

## Animation Details

- **Spinner Rotation**: 2 seconds per full rotation
- **Circles**: Different speeds for visual interest
- **Logo Pulse**: 2 seconds breathing effect
- **Loading Dots**: Sequential bounce animation (1.4s cycle)
- **Fade In**: 0.3 seconds smooth entrance
- **Shimmer Effect**: Background light animation

## Styling

The loader automatically matches your POS theme:
- Yellow/orange gradients (#f6d365, #fda085, #f6a623)
- White message card
- Left border accent (5px solid)
- Dark overlay with blur
- Responsive sizing

## Example: Login Flow (Already Implemented)

When you login with correct credentials:
1. **"Authenticating..."** (1.5 seconds)
2. **"Loading dashboard..."** (1 second)
3. Loader hides
4. Success alert shows
5. Redirects to dashboard

Try it now! Login with:
- Username: `admin@cxp.com`
- Password: `Admin123!`

Enjoy your beautiful loader! ⏳✨

