# JSON Storage Guide - Indian Mithai POS System

## 📁 Overview

Your POS system now uses **JSON files** for initial data and **localStorage** for persistent storage. All CRUD operations are automatically saved!

---

## 📂 File Structure

```
POS/
├── src/
│   ├── assets/
│   │   └── data/
│   │       ├── products.json      ← Initial product data
│   │       ├── shops.json         ← Initial shop data
│   │       ├── orders.json        ← Initial order data
│   │       └── categories.json    ← Category definitions
│   └── app/
│       └── services/
│           ├── data.service.ts       ← Manages localStorage
│           ├── product.service.ts    ← Product CRUD operations
│           ├── shop.service.ts       ← Shop CRUD operations
│           └── order.service.ts      ← Order CRUD operations
```

---

## 🔄 How It Works

### **1. Initial Load (First Time)**
```
JSON Files → DataService → localStorage → Services
```

- App starts
- `DataService` reads JSON files from `assets/data/`
- Stores data in `localStorage` with keys:
  - `mithai_products`
  - `mithai_shops`
  - `mithai_orders`
  - `mithai_categories`

### **2. Subsequent Loads**
```
localStorage → Services → UI
```

- App reads from `localStorage` (faster)
- No need to fetch JSON files again

### **3. CRUD Operations**
```
UI Action → Service → Update Array → Update localStorage
```

- Any create/update/delete operation
- Automatically saves to `localStorage`
- Data persists across page refreshes

---

## 📝 JSON File Formats

### **products.json**
```json
[
  {
    "id": 1,
    "name": "Gulab Jamun",
    "category": "Milk Based",
    "price": 120,
    "stock": 150,
    "sku": "MILK-GJ-001",
    "description": "Soft milk solid balls soaked in sugar syrup, 250g",
    "image": "🟤"
  }
]
```

### **shops.json**
```json
[
  {
    "id": 1,
    "name": "Main Store - Downtown",
    "email": "downtown@mithai.com",
    "phone": "111-222-3333",
    "address": "123 Main Street, Downtown",
    "balance": 50000
  }
]
```

### **orders.json**
```json
[
  {
    "id": 1,
    "orderNumber": "ORD-2025-0001",
    "shopId": 1,
    "shopName": "Main Store - Downtown",
    "items": [
      {
        "productId": 1,
        "productName": "Gulab Jamun",
        "quantity": 2,
        "price": 120,
        "total": 240
      }
    ],
    "subtotal": 240,
    "tax": 24,
    "discount": 0,
    "total": 264,
    "status": "completed",
    "paymentMethod": "Cash",
    "customerName": "Rajesh Kumar",
    "customerPhone": "98765-43210",
    "notes": "Festival order",
    "createdDate": "2025-10-01T10:30:00.000Z",
    "completedDate": "2025-10-01T11:00:00.000Z"
  }
]
```

### **categories.json**
```json
[
  {
    "id": 1,
    "name": "Milk Based",
    "icon": "🥛"
  }
]
```

---

## 🔧 Common Tasks

### **1. Add Initial Products**
Edit `src/assets/data/products.json` and add new products:

```json
{
  "id": 36,
  "name": "Gajar Halwa",
  "category": "Special Mithai",
  "price": 200,
  "stock": 50,
  "sku": "SPEC-GH-036",
  "description": "Carrot pudding with ghee and dry fruits, 250g",
  "image": "🥕"
}
```

Then **clear localStorage** to reload:
- Open browser DevTools (F12)
- Go to Application → LocalStorage
- Delete `mithai_products` key
- Refresh page

### **2. Reset All Data**
**Option A: Clear Browser Storage**
```javascript
// Open DevTools Console (F12) and run:
localStorage.clear();
location.reload();
```

**Option B: Use DataService (Add a reset button)**
```typescript
// In your component:
this.dataService.clearAllData();
```

### **3. Backup Data**
```javascript
// Open DevTools Console (F12) and run:
const data = {
  products: JSON.parse(localStorage.getItem('mithai_products')),
  shops: JSON.parse(localStorage.getItem('mithai_shops')),
  orders: JSON.parse(localStorage.getItem('mithai_orders')),
  categories: JSON.parse(localStorage.getItem('mithai_categories'))
};
console.log(JSON.stringify(data, null, 2));
// Copy the output and save to a file
```

### **4. Restore Data**
```javascript
// In DevTools Console:
const backupData = { /* paste your backup data here */ };
localStorage.setItem('mithai_products', JSON.stringify(backupData.products));
localStorage.setItem('mithai_shops', JSON.stringify(backupData.shops));
localStorage.setItem('mithai_orders', JSON.stringify(backupData.orders));
localStorage.setItem('mithai_categories', JSON.stringify(backupData.categories));
location.reload();
```

---

## 📊 localStorage Keys

| Key | Description | Example Size |
|-----|-------------|--------------|
| `mithai_products` | All products | ~10KB (35 products) |
| `mithai_shops` | All shops | ~2KB (3-5 shops) |
| `mithai_orders` | All orders | ~5KB (10-20 orders) |
| `mithai_categories` | Categories | ~1KB (10 categories) |
| `currentUser` | Logged in user | ~0.5KB |

**Total:** ~18-20KB (well within 5-10MB localStorage limit)

---

## 🚀 Advantages

✅ **Persistent Storage** - Data survives page refresh
✅ **No Backend Required** - Works offline
✅ **Fast Performance** - Instant data access
✅ **Easy Backup** - Export/Import JSON
✅ **Version Control** - Track changes in JSON files
✅ **Easy to Edit** - Simple JSON format

---

## ⚠️ Limitations

❌ **Single User** - No multi-user sync
❌ **Browser Specific** - Data stored per browser
❌ **Size Limit** - 5-10MB max (plenty for POS)
❌ **No Server** - Can't access from multiple devices

---

## 🔮 Future Enhancements

### **Option 1: Add Backend API**
```typescript
// Replace DataService localStorage with HTTP calls
saveProducts(products: Product[]): Observable<void> {
  return this.http.post('/api/products', products);
}
```

### **Option 2: Use IndexedDB**
```typescript
// For larger datasets (100k+ products)
import { IndexedDBService } from './indexeddb.service';
```

### **Option 3: Add Cloud Sync**
```typescript
// Sync localStorage with Firebase/Supabase
syncToCloud() {
  const data = this.exportToJSON();
  this.firestore.collection('pos-data').doc('shop1').set(data);
}
```

---

## 🛠️ Development Tips

### **Testing New Data**
1. Edit JSON files in `src/assets/data/`
2. Clear localStorage
3. Refresh page
4. New data loads from JSON

### **Debugging**
```javascript
// Check what's in localStorage:
console.log('Products:', localStorage.getItem('mithai_products'));
console.log('Shops:', localStorage.getItem('mithai_shops'));
console.log('Orders:', localStorage.getItem('mithai_orders'));
```

### **Monitor Changes**
```javascript
// Watch localStorage changes:
window.addEventListener('storage', (e) => {
  console.log('Storage changed:', e.key, e.newValue);
});
```

---

## 📱 Browser Support

✅ Chrome/Edge (Chromium)
✅ Firefox
✅ Safari
✅ Mobile browsers

**localStorage** is supported in all modern browsers since 2010!

---

## 🎯 Summary

Your Indian Mithai POS system now has:
- ✅ JSON files for initial data setup
- ✅ localStorage for persistent storage
- ✅ Automatic save on all CRUD operations
- ✅ Easy backup/restore capabilities
- ✅ No backend required for basic operation

All your products, shops, orders, and categories are now stored permanently! 🎉

