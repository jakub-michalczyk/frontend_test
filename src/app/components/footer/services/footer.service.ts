import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FooterService {
  private personalData = new BehaviorSubject<string | null>(null);
  personalData$ = this.personalData.asObservable();

  private reset = new Subject<void>();
  reset$ = this.reset.asObservable();

  showPersonalData() {
    this.personalData.next('Jakub Michalczyk');
  }

  resetData() {
    this.personalData.next(null);
    this.reset.next();
  }
}
