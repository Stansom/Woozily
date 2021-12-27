import { Injectable } from '@angular/core';
import { LoggerService } from '../logger.service';
import { ApiOptions, Parking, Poi, Vehicle } from '../types';
import { DataFetchingService } from './data-fetching.service';

@Injectable({
  providedIn: 'root',
})
export class MarkersService {
  private _name = 'Markers Service:';
  markers: google.maps.Marker[] = [];
  vehicles?: Vehicle[];
  parkings?: Parking[];
  pois?: Poi[];
  constructor(
    private logger: LoggerService,
    private dataFetchingService: DataFetchingService
  ) {}

  addMarker(marker: google.maps.Marker) {
    this.markers.push(marker);
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
    // this.logger.log(`${this._name} getting markers ${this.markers}`);
    // if (!!this.markers) {
    //   this.logger.error(`${this._name} can't get markers`);
    //   return [];
    // }
    return this.markers;
  }
}
