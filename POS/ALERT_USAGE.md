# 🔔 Alert Service - Usage Guide

## Overview
A beautiful, reusable alert notification system for your POS application with dynamic title and message support.

## Features
- ✅ **4 Alert Types**: Success, Error, Warning, Info
- 🎨 **Beautiful Design**: Gradient backgrounds with yellow theme
- ⚡ **Auto-dismiss**: Configurable auto-close duration
- 📱 **Responsive**: Works on all screen sizes
- 🎭 **Animations**: Smooth slide-in and pulse effects
- 🔒 **Type-safe**: Full TypeScript support
- 🌐 **Global**: Use anywhere in your application

## Installation
Already set up! Just inject the service and use it.

## Usage

### 1. Import the AlertService
```typescript
import { AlertService } from './services/alert.service';

export class YourComponent {
  constructor(private alertService: AlertService) {}
}
```

### 2. Show Alerts

#### Success Alert
```typescript
this.alertService.success(
  'Success!', 
  'Your operation completed successfully.'
);
```

#### Error Alert
```typescript
this.alertService.error(
  'Error!', 
  'Something went wrong. Please try again.'
);
```

#### Warning Alert
```typescript
this.alertService.warning(
  'Warning!', 
  'Please review your input before proceeding.'
);
```

#### Info Alert
```typescript
this.alertService.info(
  'Information', 
  'Here is some helpful information for you.'
);
```

### 3. Custom Duration
```typescript
// Auto-close after 3 seconds
this.alertService.success(
  'Quick Message', 
  'This will disappear in 3 seconds.',
  true,  // autoClose
  3000   // duration in milliseconds
);
```

### 4. Persistent Alert (No Auto-close)
```typescript
// User must manually close
this.alertService.error(
  'Critical Error', 
  'Please read this important message carefully.',
  false  // autoClose disabled
);
```

### 5. Manual Close
```typescript
// Close the current alert programmatically
this.alertService.clear();
```

## Complete Examples

### Login Validation
```typescript
onLogin() {
  if (this.username && this.password) {
    this.alertService.success(
      'Welcome Back!',
      `Hello ${this.username}, you're now logged in.`
    );
  } else {
    this.alertService.error(
      'Login Failed',
      'Please enter both username and password.'
    );
  }
}
```

### Form Submission
```typescript
onSubmit() {
  if (this.form.valid) {
    this.alertService.success(
      'Form Submitted',
      'Your data has been saved successfully!'
    );
  } else {
    this.alertService.warning(
      'Validation Error',
      'Please fill all required fields correctly.'
    );
  }
}
```

### API Call
```typescript
saveData() {
  this.api.save(this.data).subscribe({
    next: (response) => {
      this.alertService.success(
        'Data Saved',
        'Your changes have been saved to the database.'
      );
    },
    error: (error) => {
      this.alertService.error(
        'Save Failed',
        error.message || 'Unable to save data. Please try again.'
      );
    }
  });
}
```

### Information Message
```typescript
showHelp() {
  this.alertService.info(
    'Help',
    'Click the + button to add a new item to your cart.',
    true,
    10000  // Show for 10 seconds
  );
}
```

## Alert Types & Colors

| Type | Color | Use Case |
|------|-------|----------|
| **Success** | Green | Successful operations, confirmations |
| **Error** | Red | Failed operations, validation errors |
| **Warning** | Yellow/Orange | Cautions, important notices |
| **Info** | Blue | General information, tips, help |

## Styling
The alerts are styled to match your POS theme with:
- Yellow gradient for warnings (matches login theme)
- Left border accent (5px solid)
- Smooth animations
- Responsive design
- Close button with rotation effect

## Position
Alerts appear in the **top-right corner** of the screen and can be closed by:
- Clicking the X button
- Auto-dismiss after duration
- Calling `alertService.clear()`

## Advanced Usage

### Custom Alert Interface
```typescript
interface Alert {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  autoClose?: boolean;
  duration?: number;
}
```

### Observable Pattern
```typescript
// Subscribe to alert changes
this.alertService.alert$.subscribe(alert => {
  if (alert) {
    console.log('New alert:', alert.title, alert.message);
  }
});
```

## Best Practices

1. **Keep titles short** (2-4 words)
2. **Make messages clear** and actionable
3. **Use appropriate types** for context
4. **Set reasonable durations** (3-5 seconds for most)
5. **Don't stack alerts** - one at a time
6. **Use persistent alerts** for critical errors only

## Examples in Your App

The login component already uses the alert service:
- ✅ Success on correct credentials
- ❌ Error on wrong credentials

Try logging in with:
- **Correct**: admin@cxp.com / Admin123!
- **Wrong**: test@test.com / wrong

Enjoy your beautiful alert notifications! 🎉

