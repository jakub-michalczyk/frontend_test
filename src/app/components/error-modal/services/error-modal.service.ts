import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorModalService {
  private errorSubject = new BehaviorSubject<string | null>(null);
  error$ = this.errorSubject.asObservable();

  private modalVisibleSubject = new BehaviorSubject<boolean>(false);
  modalVisible$ = this.modalVisibleSubject.asObservable();

  constructor() {}

  showError(message: string) {
    this.errorSubject.next(message);
    this.modalVisibleSubject.next(true);
  }

  hideModal() {
    this.modalVisibleSubject.next(false);
  }
}
