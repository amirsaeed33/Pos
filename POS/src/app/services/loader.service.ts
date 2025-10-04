import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$: Observable<boolean> = this.loadingSubject.asObservable();

  private messageSubject = new BehaviorSubject<string>('Loading...');
  public message$: Observable<string> = this.messageSubject.asObservable();

  constructor() { }

  show(message: string = 'Loading...') {
    this.messageSubject.next(message);
    this.loadingSubject.next(true);
  }

  hide() {
    this.loadingSubject.next(false);
    this.messageSubject.next('Loading...');
  }

  setMessage(message: string) {
    this.messageSubject.next(message);
  }
}
