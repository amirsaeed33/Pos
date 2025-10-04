import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { LoaderService } from '../services/loader.service';
import { AuthService } from '../services/auth.service';
import { ShopService } from '../services/shop.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  showPassword = false;
  username = 'admin@cxp.com';
  password = 'Admin123!';

  constructor(
    private alertService: AlertService,
    private router: Router,
    private loaderService: LoaderService,
    private authService: AuthService,
    private shopService: ShopService,
    private dataService: DataService
  ) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    console.log('Login attempted with:', {
      username: this.username,
      password: this.password
    });

    // Show loader
    this.loaderService.show('Authenticating...');
    
    // Wait for data to be ready first
    this.dataService.dataReady$.subscribe(ready => {
      if (ready) {
        // Check if admin login
        if (this.authService.loginAsAdmin(this.username, this.password)) {
          this.loaderService.hide();
          this.alertService.success(
            'Admin Login Successful!', 
            'Welcome back Admin! Redirecting to dashboard...'
          );
          
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1000);
        } 
        // Check if shop login
        else {
          this.shopService.getShops().subscribe(shops => {
            console.log('Shops loaded for login:', shops.length, 'shops');
            const shopUser = this.authService.loginAsShop(this.username, this.password, shops);
            
            if (shopUser) {
              this.loaderService.hide();
              this.alertService.success(
                'Shop Login Successful!', 
                `Welcome ${shopUser.shop.name}! Redirecting to orders...`
              );
              
              setTimeout(() => {
                this.router.navigate(['/orders']);
              }, 1000);
            } else {
              this.loaderService.hide();
              this.alertService.error(
                'Login Failed', 
                'Invalid email or password. Shop password is: shop123'
              );
            }
          });
        }
      }
    });
  }
}
