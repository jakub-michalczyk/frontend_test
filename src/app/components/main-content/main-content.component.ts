import { CommonModule } from '@angular/common';
import {
  Component,
  ViewChild,
  TemplateRef,
  inject,
  DestroyRef,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { BlockContext, IData } from './main-content.model';
import * as DATA from '../../../shared/data.json';
import { FooterService } from '../footer/services/footer.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ModalService } from '../error-modal/services/modal.service';
import { StorageService } from '../../../shared/services/storage.service';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss'],
})
export class MainContentComponent {
  @ViewChild('formTemplate', { static: true })
  formTemplate!: TemplateRef<BlockContext>;
  @ViewChild('buttonsTemplate', { static: true })
  buttonsTemplate!: TemplateRef<BlockContext>;
  @ViewChild('contentTemplate', { static: true })
  contentTemplate!: TemplateRef<BlockContext>;
  optionLabels = ['Opcja pierwsza', 'Opcja druga', 'Opcja losowa'];
  blocks = [
    {
      key: 'form',
      title: 'BLOK PIERWSZY',
    },
    {
      key: 'buttons',
      title: 'BLOK DRUGI',
    },
    {
      key: 'content',
      title: 'BLOK Z DŁUGĄ NAZWĄ KTÓRA SAMA SIĘ PRZYTNIE...',
    },
  ];
  formGroup!: FormGroup;
  formValid$: Observable<boolean> | undefined;
  selectedContent$: BehaviorSubject<IData[]> = new BehaviorSubject<IData[]>([]);
  availableData: IData[] = [];
  errorModalTitle = 'Błąd';
  private destroyRef = inject(DestroyRef);

  constructor(
    private fb: FormBuilder,
    private modalService: ModalService,
    private footerService: FooterService,
    private storageService: StorageService
  ) {
    this.setUpForm();
    this.initializeData();
    this.setUpFooterServiceSubscription();
    this.storageService.needsRefresh$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.updateData();
      });
  }

  updateData() {
    const refreshedData = this.storageService.retrieveData();
    if (!refreshedData) {
      return;
    }
    this.availableData = refreshedData;
    const updatedContent = this.selectedContent$
      .getValue()
      .filter((currentData) =>
        refreshedData.some((data) => data.id === currentData.id)
      )
      .map((currentData) => {
        const newData = refreshedData.find(
          (data) => data.id === currentData.id
        );
        return newData ? newData : currentData;
      });

    this.sortContent(updatedContent);
  }

  setUpFooterServiceSubscription() {
    this.footerService.reset$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.formGroup.reset();
        this.formGroup.markAsPristine();
        this.selectedContent$.next([]);
      });
  }

  setUpForm() {
    this.formGroup = this.fb.group({
      option: ['', Validators.required],
    });
    this.formValid$ = this.formGroup.statusChanges.pipe(
      map((status) => status === 'VALID')
    );
  }

  initializeData() {
    if (this.storageService.retrieveData()?.length > 0) {
      this.availableData = this.storageService.retrieveData();
    } else {
      this.availableData = DATA.data;
      this.storageService.storeData(this.availableData);
    }
  }

  replaceContent() {
    if (this.isDataEmpty()) return;
    if (this.checkForRandomElements()) {
      return this.modalService.showError(
        'Nie ma dodanych żadnych elementów losowych',
        this.errorModalTitle,
        true
      );
    }
    if (this.selectedContent$.getValue().length > 0) {
      let newContentData = this.getSelectedData();
      this.selectedContent$.next([newContentData]);
    } else {
      this.modalService.showError(
        'Nie ma żadnego elementu do zastąpienia.',
        this.errorModalTitle,
        true
      );
    }
  }

  addContent() {
    if (this.isDataEmpty()) return;
    if (this.checkForRandomElements()) {
      return this.modalService.showError(
        'Nie ma dodanych żadnych elementów losowych',
        this.errorModalTitle,
        true
      );
    }

    let newContentData = this.getSelectedData();

    if (!this.selectedContent$.getValue().includes(newContentData)) {
      this.pushAndSortContent(newContentData);
    } else if (this.formGroup.get('option')?.value !== 2) {
      // if array includes this element, and it isn't a random option then throw an error
      // Error handling
      this.modalService.showError(
        'Wybrany element już został dodany.',
        this.errorModalTitle,
        true
      );
    } else {
      let allRandomAdded = this.availableData
        .slice(2)
        .every((contentData) =>
          this.selectedContent$.getValue().includes(contentData)
        );

      if (allRandomAdded) {
        // Error handling
        this.modalService.showError(
          'Wszystkie elementy zostały już dodane.',
          this.errorModalTitle,
          true
        );
      } else {
        let randomData = this.getSelectedData();
        while (this.selectedContent$.getValue().includes(randomData)) {
          randomData = this.getSelectedData();
        }
        this.pushAndSortContent(randomData);
      }
    }
  }

  getTemplate(type: string): TemplateRef<BlockContext> {
    switch (type) {
      case 'form':
        return this.formTemplate;
      case 'buttons':
        return this.buttonsTemplate;
      case 'content':
        return this.contentTemplate;
      default:
        throw new Error('Unknown block type');
    }
  }

  private pushAndSortContent = (newContentData: IData) => {
    const updatedContent = [
      ...this.selectedContent$.getValue(),
      newContentData,
    ];
    this.sortContent(updatedContent);
  };

  private sortContent(updatedContent: IData[]) {
    updatedContent.sort((a, b) => a.content.localeCompare(b.content));
    this.selectedContent$.next(updatedContent);
  }

  private getSelectedData = () => {
    let id = this.formGroup.get('option')?.value;
    return this.availableData[
      id === 0 || id === 1
        ? id
        : Math.floor(Math.random() * (this.availableData.length - 2) + 2)
    ];
  };

  private checkForRandomElements = () =>
    (this.availableData.length <= 2 &&
      this.formGroup.get('option')?.value === 2) ||
    false;

  private isDataEmpty = () => this.availableData.length === 0;
}
