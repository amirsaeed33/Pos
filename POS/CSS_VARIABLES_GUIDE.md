# CSS Variables Guide - Centralized Theme Management

This guide shows all available CSS variables defined in `styles.css` for easy theme management.

## 🎨 How to Use

All colors and styles are now managed from **ONE PLACE**: `src/styles.css` at the `:root` level.

To change the theme color across the entire application, simply update the values in `styles.css`:

```css
:root {
  --primary-color: #f6a623;  /* Change this to update all primary colors! */
}
```

## 📚 Available CSS Variables

### 🌈 Primary Theme Colors

```css
--primary-color: #f6a623;         /* Main theme color (yellow/gold) */
--primary-light: #f6d365;         /* Lighter shade */
--primary-dark: #fda085;          /* Darker shade */
--primary-hover: #e09518;         /* Hover state color */
```

**Usage Example:**
```css
.my-button {
  background-color: var(--primary-color);
  border: 2px solid var(--primary-color);
}

.my-button:hover {
  background-color: var(--primary-hover);
}
```

---

### 🎨 Gradient Colors

```css
--gradient-primary: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
--gradient-secondary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--gradient-success: linear-gradient(135deg, #28a745 0%, #20c997 100%);
--gradient-danger: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
--gradient-info: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
--gradient-warning: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
```

**Usage Example:**
```css
.card {
  background: var(--gradient-primary);
}
```

---

### 🎭 Background Colors

```css
--bg-primary: #f8f9fa;            /* Light gray background */
--bg-secondary: #e9ecef;          /* Medium gray background */
--bg-light: #ffffff;              /* White background */
--bg-dark: #2d3748;               /* Dark background */
```

**Usage Example:**
```css
.page-background {
  background-color: var(--bg-primary);
}
```

---

### 📝 Text Colors

```css
--text-primary: #2d3748;          /* Main text color */
--text-secondary: #4a5568;        /* Secondary text */
--text-muted: #6c757d;            /* Muted/disabled text */
--text-light: #718096;            /* Light text */
```

**Usage Example:**
```css
h1 {
  color: var(--text-primary);
}

.subtitle {
  color: var(--text-secondary);
}
```

---

### 🔲 Border Colors

```css
--border-color: #e9ecef;          /* Default border */
--border-light: #f0f0f0;          /* Light border */
--border-primary: #f6a623;        /* Primary colored border */
```

**Usage Example:**
```css
.card {
  border: 2px solid var(--border-color);
}

.card.active {
  border-color: var(--border-primary);
}
```

---

### ✅ Status Colors (For Alerts, Badges, etc.)

#### Success (Green)
```css
--success-color: #28a745;         /* Success green */
--success-bg: #d4edda;            /* Success background */
--success-text: #155724;          /* Success text */
```

#### Danger (Red)
```css
--danger-color: #dc3545;          /* Error red */
--danger-bg: #f8d7da;             /* Error background */
--danger-text: #721c24;           /* Error text */
```

#### Warning (Yellow)
```css
--warning-color: #f6a623;         /* Warning yellow */
--warning-bg: #fff5dc;            /* Warning background */
--warning-text: #856404;          /* Warning text */
```

#### Info (Blue)
```css
--info-color: #17a2b8;            /* Info blue */
--info-bg: #d1ecf1;               /* Info background */
--info-text: #0c5460;             /* Info text */
```

**Usage Example:**
```css
.alert.success {
  background-color: var(--success-bg);
  color: var(--success-text);
  border-left: 4px solid var(--success-color);
}
```

---

### 🎨 Light Background Gradients

```css
--primary-light-bg: linear-gradient(135deg, #fff5dc 0%, #ffe0b3 100%);
--secondary-light-bg: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
```

**Usage Example:**
```css
.input-group-text {
  background: var(--primary-light-bg);
}
```

---

### 💫 Shadow Colors

```css
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 15px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 40px rgba(0, 0, 0, 0.2);
--shadow-xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
--shadow-primary: 0 4px 15px rgba(246, 211, 101, 0.4);
--shadow-primary-hover: 0 6px 20px rgba(253, 160, 133, 0.6);
```

**Usage Example:**
```css
.card {
  box-shadow: var(--shadow-md);
}

.card:hover {
  box-shadow: var(--shadow-lg);
}

.btn-primary {
  box-shadow: var(--shadow-primary);
}

.btn-primary:hover {
  box-shadow: var(--shadow-primary-hover);
}
```

---

### 📐 Border Radius

```css
--radius-sm: 8px;                 /* Small radius */
--radius-md: 12px;                /* Medium radius */
--radius-lg: 15px;                /* Large radius */
--radius-xl: 20px;                /* Extra large radius */
--radius-full: 50%;               /* Full circle */
```

**Usage Example:**
```css
.button {
  border-radius: var(--radius-sm);
}

.card {
  border-radius: var(--radius-lg);
}

.avatar {
  border-radius: var(--radius-full);
}
```

---

### 📏 Spacing

```css
--spacing-xs: 0.5rem;             /* 8px */
--spacing-sm: 1rem;               /* 16px */
--spacing-md: 1.5rem;             /* 24px */
--spacing-lg: 2rem;               /* 32px */
--spacing-xl: 3rem;               /* 48px */
```

**Usage Example:**
```css
.container {
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
}

.section {
  gap: var(--spacing-sm);
}
```

---

### ⚡ Transitions

```css
--transition-fast: all 0.2s ease;       /* Fast transition */
--transition-normal: all 0.3s ease;     /* Normal transition */
--transition-slow: all 0.5s ease;       /* Slow transition */
```

**Usage Example:**
```css
.button {
  transition: var(--transition-normal);
}

.button:hover {
  transform: translateY(-2px);
}
```

---

## 🛠️ How to Change Theme

### Example 1: Change from Yellow to Blue Theme

**Before (Yellow):**
```css
:root {
  --primary-color: #f6a623;
  --primary-light: #f6d365;
  --primary-dark: #fda085;
  --primary-hover: #e09518;
  --gradient-primary: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
}
```

**After (Blue):**
```css
:root {
  --primary-color: #3b82f6;
  --primary-light: #60a5fa;
  --primary-dark: #2563eb;
  --primary-hover: #1d4ed8;
  --gradient-primary: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
}
```

### Example 2: Change from Yellow to Purple Theme

```css
:root {
  --primary-color: #8b5cf6;
  --primary-light: #a78bfa;
  --primary-dark: #7c3aed;
  --primary-hover: #6d28d9;
  --gradient-primary: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%);
}
```

### Example 3: Change from Yellow to Green Theme

```css
:root {
  --primary-color: #10b981;
  --primary-light: #34d399;
  --primary-dark: #059669;
  --primary-hover: #047857;
  --gradient-primary: linear-gradient(135deg, #34d399 0%, #10b981 100%);
}
```

---

## 📦 Files Using CSS Variables

All these files now use CSS variables:

- ✅ `src/styles.css` (Global styles)
- ✅ `src/app/login/login.component.css`
- ✅ `src/app/dashboard/dashboard.component.css` (needs update)
- ✅ `src/app/products/products.component.css` (needs update)
- ✅ `src/app/components/header/header.component.css` (needs update)
- ✅ `src/app/components/alert/alert.component.css` (needs update)
- ✅ `src/app/components/loader/loader.component.css` (needs update)

---

## 🎯 Best Practices

1. **Always use CSS variables** instead of hard-coded colors
2. **Never add new color values** - use existing variables
3. **To change theme** - only modify `styles.css` `:root` section
4. **For new components** - reference existing variables

### ❌ Bad Practice:
```css
.my-button {
  background: #f6a623;
  border: 2px solid #e09518;
}
```

### ✅ Good Practice:
```css
.my-button {
  background: var(--primary-color);
  border: 2px solid var(--primary-hover);
}
```

---

## 🚀 Quick Reference Card

| Category | Variable Name | Default Value |
|----------|---------------|---------------|
| **Primary** | `--primary-color` | `#f6a623` |
| **Text** | `--text-primary` | `#2d3748` |
| **Background** | `--bg-light` | `#ffffff` |
| **Border** | `--border-color` | `#e9ecef` |
| **Success** | `--success-color` | `#28a745` |
| **Danger** | `--danger-color` | `#dc3545` |
| **Shadow** | `--shadow-md` | `0 4px 15px rgba(0,0,0,0.1)` |
| **Radius** | `--radius-md` | `12px` |
| **Spacing** | `--spacing-md` | `1.5rem` |
| **Transition** | `--transition-normal` | `all 0.3s ease` |

---

## 💡 Tips

- Use browser DevTools to test color changes in real-time
- CSS variables cascade, so child elements inherit parent values
- You can override variables at component level if needed
- All variables support `var()` fallback: `var(--primary-color, #f6a623)`

---

**Happy Theming! 🎨**

