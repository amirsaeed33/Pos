import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../components/header/header.component';

interface StatCard {
  id: number;
  title: string;
  value: string | number;
  label: string;
  trend: string;
  trendType: 'positive' | 'negative' | 'neutral';
  icon: string;
  colorClass: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule, HeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  statCards: StatCard[] = [];

  ngOnInit() {
    this.loadStatCards();
  }

  loadStatCards() {
    this.statCards = [
      {
        id: 1,
        title: 'Sales',
        value: '$24,500',
        label: "Today's Sales",
        trend: '+15% from yesterday',
        trendType: 'positive',
        icon: 'M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.6v-.709c1.4-.098 2.218-.846 2.218-1.932 0-.987-.626-1.496-1.745-1.76l-.473-.112V5.57c.6.068.982.396 1.074.85h1.052c-.076-.919-.864-1.638-2.126-1.716V4h-.6v.719c-1.195.117-2.01.836-2.01 1.853 0 .9.606 1.472 1.613 1.707l.397.098v2.034c-.615-.093-1.022-.43-1.114-.9zm2.177-2.166c-.59-.137-.91-.416-.91-.836 0-.47.345-.822.915-.925v1.76h-.005zm.692 1.193c.717.166 1.048.435 1.048.91 0 .542-.412.914-1.135.982V8.518z M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16',
        colorClass: 'stat-sales'
      },
      {
        id: 2,
        title: 'Orders',
        value: 156,
        label: 'Orders',
        trend: '+8% from yesterday',
        trendType: 'positive',
        icon: 'M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z',
        colorClass: 'stat-orders'
      },
      {
        id: 3,
        title: 'Products',
        value: 842,
        label: 'Products',
        trend: 'Stock available',
        trendType: 'neutral',
        icon: 'M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2',
        colorClass: 'stat-products'
      },
      {
        id: 4,
        title: 'Customers',
        value: '2,341',
        label: 'Customers',
        trend: '+12 new today',
        trendType: 'positive',
        icon: 'M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4',
        colorClass: 'stat-customers'
      }
    ];
  }

  // Method to update card data (useful for API calls)
  updateCardValue(id: number, newValue: string | number) {
    const card = this.statCards.find(c => c.id === id);
    if (card) {
      card.value = newValue;
    }
  }

  // Method to update card trend
  updateCardTrend(id: number, trend: string, trendType: 'positive' | 'negative' | 'neutral') {
    const card = this.statCards.find(c => c.id === id);
    if (card) {
      card.trend = trend;
      card.trendType = trendType;
    }
  }
}
