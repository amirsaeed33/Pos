# Bootstrap Classes Guide for POS System

## Overview
This guide documents all reusable form, button, and UI classes available in the POS system. Most styling is now centralized in `styles.css` using Bootstrap-like conventions.

---

## 🎨 **Form Elements**

### **Labels**
```html
<label class="form-label">Username</label>
```
- Font weight: 600
- Color: Secondary text color
- Margin bottom: Small spacing

### **Text Inputs**
```html
<input type="text" class="form-control" placeholder="Enter text">
<input type="email" class="form-control" placeholder="Enter email">
<input type="password" class="form-control" placeholder="Enter password">
```
- Border: 2px solid
- Padding: 10px 12px
- Focus: Primary color border with shadow
- Disabled: Grayed out with reduced opacity

### **Select Dropdowns**
```html
<select class="form-select">
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```
- Same styling as `.form-control`
- Focus state with primary color

### **Textareas**
```html
<textarea class="form-control" rows="4"></textarea>
```
- Same styling as `.form-control`

### **Input Groups**
```html
<div class="input-group">
  <span class="input-group-text">@</span>
  <input type="text" class="form-control">
</div>
```
- `.input-group-text`: Background with primary light color
- Automatically styled on focus

---

## 🔘 **Buttons**

### **Primary Button**
```html
<button class="btn btn-primary">Primary</button>
<button class="btn btn-gradient">Primary Gradient</button>
```
- Background: Primary color (`#f6a623`)
- Hover: Darker shade with lift effect
- Font weight: 600

### **Secondary Button**
```html
<button class="btn btn-secondary">Secondary</button>
```
- Background: Gray (`#6c757d`)
- Hover: Darker gray with lift effect

### **Success Button**
```html
<button class="btn btn-success">Success</button>
```
- Background: Green (`#28a745`)
- Used for confirmation actions

### **Danger Button**
```html
<button class="btn btn-danger">Delete</button>
```
- Background: Red (`#dc3545`)
- Used for destructive actions

### **Info Button**
```html
<button class="btn btn-info">Info</button>
```
- Background: Cyan (`#17a2b8`)
- Used for informational actions

### **Outline Buttons**
```html
<button class="btn btn-outline-primary">Outline</button>
```
- Transparent background with colored border
- Fills with color on hover

### **Button Sizes**
```html
<button class="btn btn-primary btn-sm">Small</button>
<button class="btn btn-primary">Normal</button>
<button class="btn btn-lg">Large</button>
```
- `.btn-sm`: Smaller padding (6px 12px), min-height 32px
- `.btn-lg`: Larger padding (12px 24px), min-height 48px

### **Block Button (Full Width)**
```html
<button class="btn btn-primary btn-block">Full Width</button>
```
- Takes 100% width of parent container

### **Button Groups**
```html
<div class="btn-group">
  <button class="btn btn-primary">Left</button>
  <button class="btn btn-primary">Middle</button>
  <button class="btn btn-primary">Right</button>
</div>
```
- Buttons are seamlessly connected
- First button: Rounded left corners
- Last button: Rounded right corners

---

## 🏷️ **Badges**

### **Basic Badges**
```html
<span class="badge badge-primary">Primary</span>
<span class="badge badge-secondary">Secondary</span>
<span class="badge badge-success">Success</span>
<span class="badge badge-warning">Warning</span>
<span class="badge badge-danger">Danger</span>
<span class="badge badge-info">Info</span>
```
- Rounded pill shape
- Font weight: 600
- Padding: 0.4rem 0.8rem

### **Badge Colors**
- `.badge-primary`: Yellow/Gold background
- `.badge-secondary`: Purple background
- `.badge-success`: Light green background with dark green text
- `.badge-warning`: Light yellow background with dark yellow text
- `.badge-danger`: Light red background with dark red text
- `.badge-info`: Light cyan background with dark cyan text

---

## 🃏 **Cards**

### **Basic Card**
```html
<div class="card">
  <div class="card-header">
    Card Header
  </div>
  <div class="card-body">
    Card content goes here
  </div>
  <div class="card-footer">
    Card Footer
  </div>
</div>
```
- `.card`: Main container with border and shadow
- `.card-header`: Top section with border bottom
- `.card-body`: Main content area with padding
- `.card-footer`: Bottom section with border top

---

## 📊 **Tables**

### **Basic Table**
```html
<table class="table">
  <thead>
    <tr>
      <th>Header 1</th>
      <th>Header 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Data 1</td>
      <td>Data 2</td>
    </tr>
  </tbody>
</table>
```
- `.table`: Full-width table with proper spacing
- `thead th`: Primary color background, white text, uppercase
- `tbody tr:hover`: Hover effect on rows

### **Responsive Table**
```html
<div class="table-responsive">
  <table class="table">
    <!-- table content -->
  </table>
</div>
```
- Enables horizontal scrolling on mobile devices

---

## 🎯 **Bootstrap Grid Classes**

### **Container**
```html
<div class="container">...</div>
<div class="container-fluid">...</div>
```
- `.container`: Fixed-width container
- `.container-fluid`: Full-width container

### **Rows & Columns**
```html
<div class="row">
  <div class="col-md-6">Half width on medium screens</div>
  <div class="col-md-6">Half width on medium screens</div>
</div>

<div class="row">
  <div class="col-12 col-md-4">Full on mobile, 1/3 on desktop</div>
  <div class="col-12 col-md-4">Full on mobile, 1/3 on desktop</div>
  <div class="col-12 col-md-4">Full on mobile, 1/3 on desktop</div>
</div>
```

### **Gap/Gutters**
```html
<div class="row g-3">...</div>  <!-- Gap of 1rem between columns -->
<div class="row g-4">...</div>  <!-- Gap of 1.5rem between columns -->
```

---

## 🔧 **Utility Classes**

### **Spacing**
```html
<!-- Margins -->
<div class="mb-3">Margin bottom</div>
<div class="mt-4">Margin top</div>
<div class="mx-auto">Margin horizontal auto</div>

<!-- Padding -->
<div class="p-4">Padding all sides</div>
<div class="px-3">Padding horizontal</div>
<div class="py-2">Padding vertical</div>
```

### **Display**
```html
<div class="d-flex">Flexbox</div>
<div class="d-block">Block</div>
<div class="d-none">Hidden</div>
<div class="d-inline-block">Inline block</div>
```

### **Flexbox**
```html
<div class="d-flex justify-content-between">Space between</div>
<div class="d-flex justify-content-center">Center</div>
<div class="d-flex align-items-center">Vertically center</div>
<div class="d-flex flex-column">Column direction</div>
<div class="d-flex gap-3">Gap between flex items</div>
```

### **Text Alignment**
```html
<div class="text-center">Centered text</div>
<div class="text-start">Left aligned</div>
<div class="text-end">Right aligned</div>
```

### **Font Weight**
```html
<span class="fw-bold">Bold</span>
<span class="fw-semibold">Semi-bold</span>
<span class="fw-normal">Normal</span>
```

### **Text Size**
```html
<p class="small">Smaller text</p>
<p class="fs-5">Font size 5</p>
```

### **Text Color**
```html
<p class="text-muted">Muted text</p>
<p class="text-white">White text</p>
<p class="text-white-50">White text 50% opacity</p>
```

---

## 📱 **Responsive Classes**

### **Breakpoints**
- `xs`: < 576px (Mobile phones)
- `sm`: ≥ 576px (Large phones)
- `md`: ≥ 768px (Tablets)
- `lg`: ≥ 992px (Desktops)
- `xl`: ≥ 1200px (Large desktops)
- `xxl`: ≥ 1400px (Extra large desktops)

### **Responsive Columns**
```html
<div class="col-12 col-sm-6 col-md-4 col-lg-3">
  <!-- Full width on mobile, half on small, 1/3 on medium, 1/4 on large -->
</div>
```

### **Responsive Display**
```html
<div class="d-none d-md-block">Hidden on mobile, visible on desktop</div>
<div class="d-block d-md-none">Visible on mobile, hidden on desktop</div>
```

---

## 💡 **Best Practices**

1. **Always use Bootstrap classes first** before writing custom CSS
2. **Use global styles** from `styles.css` for consistency
3. **Avoid duplicating styles** - leverage existing classes
4. **Use utility classes** for spacing and alignment
5. **Keep component-specific CSS minimal** - only unique styles
6. **Use CSS variables** for colors and spacing
7. **Test responsiveness** on all breakpoints

---

## 🎨 **CSS Variables Available**

All these variables are defined in `styles.css` and can be used in custom CSS:

```css
/* Colors */
--primary-color
--primary-hover
--primary-light
--primary-dark
--primary-light-bg

/* Text Colors */
--text-primary
--text-secondary
--text-muted

/* Background Colors */
--bg-primary
--bg-secondary
--bg-light

/* Status Colors */
--success-color, --success-bg, --success-text
--danger-color, --danger-bg, --danger-text
--warning-color, --warning-bg, --warning-text
--info-color, --info-bg, --info-text

/* Spacing */
--spacing-xs, --spacing-sm, --spacing-md, --spacing-lg, --spacing-xl

/* Border */
--border-color, --border-light
--radius-sm, --radius-md, --radius-lg, --radius-full

/* Shadows */
--shadow-sm, --shadow-md, --shadow-lg
--shadow-primary, --shadow-primary-hover

/* Transitions */
--transition-fast, --transition-normal, --transition-slow
```

---

## 📝 **Example: Complete Form**

```html
<form>
  <div class="mb-3">
    <label for="name" class="form-label">Full Name</label>
    <input type="text" class="form-control" id="name" placeholder="Enter your name">
  </div>
  
  <div class="mb-3">
    <label for="email" class="form-label">Email</label>
    <input type="email" class="form-control" id="email" placeholder="Enter email">
  </div>
  
  <div class="mb-3">
    <label for="category" class="form-label">Category</label>
    <select class="form-select" id="category">
      <option>Select category</option>
      <option>Electronics</option>
      <option>Clothing</option>
    </select>
  </div>
  
  <div class="mb-3">
    <label for="description" class="form-label">Description</label>
    <textarea class="form-control" id="description" rows="3"></textarea>
  </div>
  
  <div class="d-flex gap-2 justify-content-end">
    <button type="button" class="btn btn-secondary">Cancel</button>
    <button type="submit" class="btn btn-primary">Submit</button>
  </div>
</form>
```

---

## 🚀 **Quick Reference**

| Element | Class | Usage |
|---------|-------|-------|
| Text Input | `.form-control` | Standard text input |
| Dropdown | `.form-select` | Select dropdown |
| Label | `.form-label` | Form label |
| Primary Button | `.btn .btn-primary` | Main action |
| Secondary Button | `.btn .btn-secondary` | Secondary action |
| Danger Button | `.btn .btn-danger` | Delete/Remove |
| Small Button | `.btn .btn-sm` | Compact button |
| Badge | `.badge .badge-*` | Status indicator |
| Card | `.card` | Content container |
| Table | `.table` | Data table |
| Flex Container | `.d-flex` | Flexbox layout |
| Gap | `.gap-3` | Spacing between flex items |
| Margin Bottom | `.mb-3` | Bottom margin |

---

**Need more Bootstrap classes?** Visit [Bootstrap 5 Documentation](https://getbootstrap.com/docs/5.0/getting-started/introduction/)

