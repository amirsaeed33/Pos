import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../services/loader.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-loader',
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})
export class LoaderComponent implements OnInit, OnDestroy {
  loading = false;
  message = 'Loading...';
  private subscription: Subscription = new Subscription();

  constructor(private loaderService: LoaderService) {}

  ngOnInit() {
    this.subscription.add(
      this.loaderService.loading$.subscribe(loading => {
        this.loading = loading;
      })
    );

    this.subscription.add(
      this.loaderService.message$.subscribe(message => {
        this.message = message;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
