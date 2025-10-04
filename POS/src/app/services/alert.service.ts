import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Alert {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  autoClose?: boolean;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertSubject = new BehaviorSubject<Alert | null>(null);
  public alert$: Observable<Alert | null> = this.alertSubject.asObservable();

  constructor() { }

  success(title: string, message: string, autoClose: boolean = true, duration: number = 5000) {
    this.show({
      id: this.generateId(),
      type: 'success',
      title,
      message,
      autoClose,
      duration
    });
  }

  error(title: string, message: string, autoClose: boolean = true, duration: number = 5000) {
    this.show({
      id: this.generateId(),
      type: 'error',
      title,
      message,
      autoClose,
      duration
    });
  }

  warning(title: string, message: string, autoClose: boolean = true, duration: number = 5000) {
    this.show({
      id: this.generateId(),
      type: 'warning',
      title,
      message,
      autoClose,
      duration
    });
  }

  info(title: string, message: string, autoClose: boolean = true, duration: number = 5000) {
    this.show({
      id: this.generateId(),
      type: 'info',
      title,
      message,
      autoClose,
      duration
    });
  }

  private show(alert: Alert) {
    this.alertSubject.next(alert);

    if (alert.autoClose) {
      setTimeout(() => {
        this.clear();
      }, alert.duration);
    }
  }

  clear() {
    this.alertSubject.next(null);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
