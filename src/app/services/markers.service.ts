import { Injectable } from '@angular/core';
import { ApiOptions, Parking, Poi, Vehicle } from '../types';
import { DataFetchingService } from './data-fetching.service';
import { LoggerService } from '../services/logger.service';
import { MapService } from './map.service';
import { ClusterService } from './cluster.service';

@Injectable({
  providedIn: 'root',
})
export class MarkersService {
  private _name = 'Markers Service:';
  private _markers: google.maps.Marker[] = [];
  vehicles?: Vehicle[];
  parkings?: Parking[];
  pois?: Poi[];

  constructor(
    private map: MapService,
    private logger: LoggerService,
    private dataFetchingService: DataFetchingService // private clustererService: ClusterService
  ) {}

  addMarker(marker: google.maps.Marker) {
    this._markers.push(marker);
  }

  // fetchData() {
  //   for (let option in ApiOptions) {
  //     this.dataFetchingService.fetchData(option).subscribe((data: any) => {
  //       const unpacked = data['objects'];
  //       switch (option) {
  //         case 'VEHICLE':
  //           this.vehicles = unpacked as Vehicle[];
  //           break;
  //         case 'PARKING':
  //           this.parkings = unpacked as Parking[];
  //           break;
  //         case 'POI':
  //           this.pois = unpacked as Poi[];
  //           break;
  //         default:
  //           this.logger.error(`${this._name} can't get data`);
  //       }
  //     });
  //   }

  // }

  getMarkers(): google.maps.Marker[] {
    return this._markers;
  }

  // clearMarkers(): void {
  //   // for (let i = 0; i < this.markers.length; i++) {
  //   //   console.log(this.markers);
  //   //   this.markers[i].setMap(null);
  //   // }
  //   // this.markers = [];

  //   this.markers.forEach((marker) => marker.setVisible(false));
  // }

  // setMarkers(): void {
  //   // for (let i = 0; i < this.markers.length; i++) {
  //   //   console.log(this.markers);
  //   //   this.markers[i].setMap(this.map.getMap());
  //   // }
  //   const mark = this.markers.filter((item) => console.log(item));
  // }

  hideExcept(title: string): void {
    const map = this.map.getMap();
    const filtered = this._markers.filter(
      (marker) => marker.getTitle() !== title
    );
    if (title === '') {
      // this.markers.forEach((marker) => marker.setMap(map));
      // for (let i = 0; i < this.markers.length; i++) {
      //  console.log(this.markers);
      // this.markers[i].setVisible(true);
      // }
      // console.log(this.markers);
      this._markers.forEach((marker) => marker.setVisible(true));

      return;
    }

    this._markers.forEach((marker) => marker.setVisible(true));
    filtered.forEach((marker) => marker.setVisible(false));
    // console.log(filtered);
  }
}
