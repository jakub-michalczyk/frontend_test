import { CommonModule } from '@angular/common';
import { Component, ViewChild, TemplateRef } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BlockContext, IData } from './main-content.model';
import * as DATA from '../../../shared/data.json';

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
  selectedContent: IData[] = [];
  availableData: IData[] = [];

  constructor(private fb: FormBuilder) {
    this.setUpForm();
    this.initializeData();
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
    if (this.retrieveData()?.length > 0) {
      this.availableData = this.retrieveData();
    } else {
      this.availableData = DATA.data;
      this.storeData(this.availableData);
    }
  }

  replaceContent() {
    if (this.isDataEmpty()) return;

    if (this.selectedContent.length > 0) {
      this.selectedContent = [this.getSelectedData()];
    } else {
      // Error handling
    }
  }

  addContent() {
    if (this.isDataEmpty()) return;
    let newContentData = this.getSelectedData();

    if (!this.selectedContent.includes(newContentData)) {
      this.pushAndSortContent(newContentData);
    } else if (this.formGroup.get('option')?.value !== 2) {
      // if array includes this element, and it isn't a random option than throw an error
      // Error handling
    } else {
      let allRandomAdded = this.availableData
        .slice(2)
        .every((contentData) => this.selectedContent.includes(contentData));

      if (allRandomAdded) {
        // Error handling
      } else {
        let randomData = this.getSelectedData();
        while (this.selectedContent.includes(randomData)) {
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
    this.selectedContent.push(newContentData);
    this.selectedContent.sort((a, b) => a.content.localeCompare(b.content));
  };

  private getSelectedData = () => {
    let id = this.formGroup.get('option')?.value;
    return this.availableData[
      id === 0 || id === 1
        ? id
        : Math.floor(Math.random() * (this.availableData.length - 2) + 2)
    ];
  };

  private isDataEmpty = () => this.availableData.length === 0;

  private retrieveData = (): IData[] =>
    JSON.parse(localStorage.getItem('data')!);

  private storeData = (data: IData[]) =>
    localStorage.setItem('data', JSON.stringify(data));
}
