import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Self} from '@angular/core';
import * as L from 'leaflet';
import {INIT_POSITION, LAYER_URL, MAP_CONFIG} from './shared/data/init-data';
import {ITree} from '../tree/shared/interfaces/tree.interface';
import {MapActionsService} from '../@core/shared/services/map-actions.service';
import {takeUntil} from 'rxjs/operators';
import {NgOnDestroy} from '../@core/shared/services/destroy.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgOnDestroy]
})
export class MapComponent implements OnInit {
  map: any;
  layerUrl: string = LAYER_URL;
  initConfig = MAP_CONFIG;
  initPosition = INIT_POSITION;
  selectedCities: ITree[] = [];
  markers = [];

  constructor(private mapActionsService: MapActionsService,
              private cdRef: ChangeDetectorRef,
              @Self() private onDestroy$: NgOnDestroy) {
  }

  ngOnInit() {
    this.initMap();
    this.getSelectedCitiesList();
    this.mapActionsService.selectedCity
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((city: ITree) => this.addMarkToMap(city));
  }

  initMap() {
    this.map = L.map('map', this.initPosition);
    const tiles = L.tileLayer(this.layerUrl, this.initConfig);
    tiles.addTo(this.map);
  }

  getSelectedCitiesList() {
    this.mapActionsService.selectedCity
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((cities: ITree) => this.selectedCities.push(cities));
  }

  addMarkToMap(city: ITree) {
    this.markers.push(L.marker(city.coordinates, {city}).addTo(this.map).on('mouseover', item => {
      this.removeMarker(item.target);
    }));

  }

  removeMarker(city) {
    this.map.removeLayer(city);
    this.mapActionsService.hideCity(city.options.city);
  }
}
