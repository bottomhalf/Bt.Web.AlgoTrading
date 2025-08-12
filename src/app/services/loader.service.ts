import { Injectable } from '@angular/core';
import { BehaviorSubject, delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loading = new BehaviorSubject<boolean>(false);
  private loadPercentage = new BehaviorSubject<number>(20);
  readonly isLoading = this.loading.asObservable().pipe(delay(0));
  readonly loadPercentage$ = this.loadPercentage.asObservable().pipe(delay(0));
  constructor() { }

  showLoader() {
    this.loadPercentage.next(20);
    this.loading.next(true);
  }

  hideLoader() {
    this.loadPercentage.next(100);
    setTimeout(() => {
      this.loading.next(false);
    }, 300);
  }
}
