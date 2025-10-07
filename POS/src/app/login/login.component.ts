import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { LoaderService } from '../services/loader.service';
import { AuthService } from '../services/auth.service';

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
    private authService: AuthService
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
    
    // Call backend API for authentication
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        this.loaderService.hide();
        
        console.log('Login API Response:', response);
        console.log('User Role:', response.user?.role);
        
        if (response.success && response.user) {
          // Success - show message and redirect based on role
          this.alertService.success(
            'Login Successful!', 
            `Welcome ${response.user.name}! Redirecting...`
          );
          
          setTimeout(() => {
            // Redirect based on user role
            const userRole = response.user?.role?.toLowerCase();
            console.log('Redirecting user with role:', userRole);
            
            if (userRole === 'admin') {
              console.log('Navigating to /dashboard');
              this.router.navigate(['/dashboard']);
            } else {
              console.log('Navigating to /orders');
              this.router.navigate(['/orders']);
            }
          }, 1000);
        } else {
          // Login failed - show error
          this.alertService.error(
            'Login Failed', 
            response.message || 'Invalid email or password'
          );
        }
      },
      error: (error) => {
        this.loaderService.hide();
        
        let errorMessage = 'Unable to connect to the server. Please try again.';
        
        // Provide more specific error messages
        if (error.message.includes('code 0')) {
          errorMessage = 'Network connection failed. Please check your internet connection and try again.';
        } else if (error.message.includes('Invalid email or password')) {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        this.alertService.error('Login Error', errorMessage);
        console.error('Login error:', error);
      }
    });
  }
}
