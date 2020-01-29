import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {ITree} from '../../../tree/shared/interfaces/tree.interface';

@Injectable({
  providedIn: 'root'
})
export class MapActionsService {
  selectedCity: Subject<ITree> = new Subject();
  hiddenCity: Subject<ITree> = new Subject();
  removedCity: Subject<ITree> = new Subject();

  selectCity(city: ITree) {
    this.selectedCity.next(city);
  }

  hideCity(city: ITree) {
    this.hiddenCity.next(city);
  }

  removeCity(city: ITree) {
    this.removedCity.next(city);
  }
}
