import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductsComponent } from './products/products.component';
import { ShopSettingsComponent } from './shop-settings/shop-settings.component';
import { OrdersComponent } from './orders/orders.component';
import { CreateOrderComponent } from './create-order/create-order.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'sales', component: DashboardComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'inventory', component: DashboardComponent },
  { path: 'reports', component: DashboardComponent },
  { path: 'shops', component: ShopSettingsComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'create-order', component: CreateOrderComponent }
];
