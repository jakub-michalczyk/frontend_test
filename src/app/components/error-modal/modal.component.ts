import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ModalService } from './services/modal.service';
import { IEditedModal, IModal } from './modal.model';
import * as DATA from '../../../shared/data.json';
import { StorageService } from '../../../shared/services/storage.service';
import { IData } from '../main-content/main-content.model';
import { CommonModule } from '@angular/common';
import { filter, takeUntil } from 'rxjs';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  modal: IModal | null = null;
  modalVisible = false;
  availableData: IData[] = [];
  currentlyAddedOrEdited = {} as IEditedModal;
  viewAddingMode = false;
  newAddedElement = {} as IEditedModal;
  private destroyRef = inject(DestroyRef);

  constructor(
    private modalService: ModalService,
    protected storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.initializeData();
    this.initModal();
  }

  initModal() {
    this.storageService.needsRefresh$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.initializeData());

    this.modalService.modalSubject$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((modal) => {
        this.modal = modal;
      });
  }

  initializeData() {
    if (this.storageService.retrieveData()?.length > 0) {
      this.availableData = this.storageService.retrieveData();
    } else {
      this.availableData = DATA.data;
      this.storageService.storeData(this.availableData);
    }
  }

  onClose() {
    this.modalService.hideModal();
  }

  confirm() {
    if (
      this.currentlyAddedOrEdited &&
      this.viewAddingMode &&
      this.currentlyAddedOrEdited.content
    ) {
      this.storageService.addNewElement(this.currentlyAddedOrEdited as IData);
      this.currentlyAddedOrEdited = {} as IEditedModal;
    }
    this.viewAddingMode = false;
    this.onClose();
  }

  storeChanges(target: EventTarget | null) {
    this.currentlyAddedOrEdited.content = (target as HTMLTextAreaElement).value;
  }

  saveChanges(id: number, content: string) {
    this.currentlyAddedOrEdited.id = null;
    this.storageService.saveChanges(id, content);
  }

  add() {
    this.viewAddingMode = true;
    this.currentlyAddedOrEdited.id =
      this.availableData[this.availableData.length - 1].id + 1;
  }
}
