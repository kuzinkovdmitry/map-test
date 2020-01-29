import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Self} from '@angular/core';
import {MapActionsService} from '../@core/shared/services/map-actions.service';
import {ITree} from '../tree/shared/interfaces/tree.interface';
import {NgOnDestroy} from '../@core/shared/services/destroy.service';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgOnDestroy]
})
export class ListComponent implements OnInit {
  citiesList: ITree[] = [];

  constructor(private mapActionsService: MapActionsService,
              private cdRef: ChangeDetectorRef,
              @Self() private onDestroy$: NgOnDestroy) {
  }

  ngOnInit() {
    this.getHiddenCitiesList();
  }

  getHiddenCitiesList() {
    this.mapActionsService.hiddenCity
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((city: ITree) => {
        this.citiesList.push(city);
        this.cdRef.detectChanges();
      });
  }

  removeSelectedCity(city: ITree) {
    this.mapActionsService.removeCity(city);
    this.citiesList = this.citiesList.filter((item: ITree) => city.id !== item.id);
    this.cdRef.detectChanges();
  }
}
