import { Component, signal } from '@angular/core';
import { FooterService } from './services/footer.service';
import { ModalService } from '../error-modal/services/modal.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  icon = signal('keyboard_arrow_up');
  constructor(
    protected footerService: FooterService,
    private modalService: ModalService
  ) {}

  editData() {
    this.modalService.showError('', 'Edycja danych', false);
  }

  updateButtonIcon() {
    this.icon().includes('up')
      ? this.icon.set('keyboard_arrow_down')
      : this.icon.set('keyboard_arrow_up');
  }
}
