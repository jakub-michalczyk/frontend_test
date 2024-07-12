import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { ErrorModalService } from './services/error-modal.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-error-modal',
  standalone: true,
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.scss'],
})
export class ErrorModalComponent implements OnInit {
  errorMessage: string | null = null;
  modalVisible = false;
  private destroyRef = inject(DestroyRef);

  constructor(private errorModalService: ErrorModalService) {}

  ngOnInit(): void {
    this.errorModalService.modalVisible$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((visible) => {
        this.modalVisible = visible;
        if (!visible) {
          this.errorMessage = null;
        }
      });

    this.errorModalService.error$.subscribe((message) => {
      this.errorMessage = message;
    });
  }

  onClose() {
    this.errorModalService.hideModal();
  }
}
