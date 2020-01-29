import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Self} from '@angular/core';
import {TREE_DATA} from './shared/data/tree-data';
import {MatTreeNestedDataSource} from '@angular/material';
import {NestedTreeControl} from '@angular/cdk/tree';
import {ITree} from './shared/interfaces/tree.interface';
import {MapActionsService} from '../@core/shared/services/map-actions.service';
import {takeUntil} from 'rxjs/operators';
import {NgOnDestroy} from '../@core/shared/services/destroy.service';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgOnDestroy]
})
export class TreeComponent implements OnInit {
  treeControl = new NestedTreeControl<ITree>(node => node.children);
  dataSource = new MatTreeNestedDataSource<ITree>();
  treeData = TREE_DATA;

  constructor(private mapActionsService: MapActionsService,
              private cdRef: ChangeDetectorRef,
              @Self() private onDestroy$: NgOnDestroy) {
    this.dataSource.data = this.treeData;
  }

  ngOnInit() {
    this.getSelectedCity();
    this.getRemovedCity();
  }

  selectCity(node: ITree) {
    if (!node.selected) {
      this.treeControl.expand(node);
      if (this.hasChild(1, node)) {
        node.children.forEach((item: ITree) => this.selectCity(item));
      } else {
        this.mapActionsService.selectCity(node);
      }
    }
  }

  getSelectedCity() {
    this.mapActionsService.selectedCity
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((cities: ITree) => this.toggleSelectState(cities, 'select'));
  }

  getRemovedCity() {
    this.mapActionsService.removedCity
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((removedCity: ITree) => this.toggleSelectState(removedCity, 'remove'));
  }

  toggleSelectState(cityType: ITree, action: string) {
    this.treeData.forEach((mainland, mainLandIndex) => {
      mainland.children.forEach((country, countryIndex) => {
        country.children.forEach((city, cityIndex) => {
          if (city.id === cityType.id) {
            this.treeData[mainLandIndex].children[countryIndex].children[cityIndex] = {
              ...city,
              selected: action === 'select'
            };
          }
        });
      });
    });
    this.refreshTree();
  }


  refreshTree() {
    this.dataSource.data = null;
    this.dataSource.data = this.treeData;
    this.cdRef.detectChanges();
  }

  hasChild(_: number, node: ITree) {
    return !!node.children && node.children.length > 0;
  }
}
