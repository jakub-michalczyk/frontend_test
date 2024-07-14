import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IModal } from '../modal.model';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalSubject = new BehaviorSubject<IModal | null>(null);
  modalSubject$ = this.modalSubject.asObservable();

  constructor() {}

  showError(message: string, title: string, error: boolean) {
    this.modalSubject.next({ message, title, error });
  }

  hideModal() {
    this.modalSubject.next(null);
  }
}
