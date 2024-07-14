import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IData } from '../../app/components/main-content/main-content.model';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private needsRefresh = new Subject<void>();
  needsRefresh$ = this.needsRefresh.asObservable();

  retrieveData = (): IData[] => JSON.parse(localStorage.getItem('data')!);

  storeData = (data: IData[]) =>
    localStorage.setItem('data', JSON.stringify(data));

  deleteData(id: number) {
    let data = this.retrieveData().filter((dataElem) => dataElem.id !== id);
    this.storeData(data);
    this.needsRefresh.next();
  }

  saveChanges(id: number, content: string) {
    let data = this.retrieveData().map((dataElem) =>
      dataElem.id === id ? { ...dataElem, content } : dataElem
    );
    this.storeData(data);
    this.needsRefresh.next();
  }

  addNewElement(newElement: IData) {
    let data = [...this.retrieveData(), newElement];
    this.storeData(data);
    this.needsRefresh.next();
  }
}
