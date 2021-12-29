import { Component, OnInit, ViewChild } from '@angular/core';
import { DataFetchingService } from '../services/data-fetching.service';
import { MapService } from '../services/map.service';
import {
  ApiOptions,
  Vehicle,
  Location,
  Vehicles,
  Parking,
  ObjectType,
  Poi,
  Marker,
} from '../types';
import * as Icons from '../iconsFromPaths';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { MarkerComponent } from '../marker/marker.component';
import { MarkersService } from '../services/markers.service';
import { LoggerService } from '../services/logger.service';
import { ClusterService } from '../services/cluster.service';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css'],
})
export class MapsComponent implements OnInit {
  appTitle: string = 'Wozimy';
  centerOfMap = { lat: 52.1935161702226, lng: 20.9304286193486 };
  map?: google.maps.Map;
  vehicles: Vehicle[] = [];
  parkings: Parking[] = [];
  pois: Poi[] = [];
  objects?: ObjectType[][] = [];

  vehicleMarkers: Marker[] = [];
  parkingMarkers: Marker[] = [];
  poiMarkers: Marker[] = [];

  allMarkers: google.maps.Marker[] = [];
  cachedAllMarkers: google.maps.Marker[] = [];

  constructor(
    private dataFetchingService: DataFetchingService,
    private mapService: MapService,
    private markersService: MarkersService,
    private logger: LoggerService,
    private markerClusterer: ClusterService
  ) {}

  ngOnInit(): void {
    // this.mapService.createMap().then(() => {
    //   this.markersService.fetchData().then(() => {
    //     this.markersService.convertAllToMarkers();
    //     [this.vehicleMarkers, this.parkingMarkers, this.poiMarkers] =
    //       this.markersService.getConvertedMarkers();
    //     this.allMarkers = this.markersService.getMarkers();

    //     this.markerClusterer.initClusters();
    //   });
    // });

    this.mapService.createMap().then(() => {
      this.markersService.renderMarkers();
      this.allMarkers = this.markersService.getMarkers();

      this.markerClusterer.initClusters();
    });
  }

  ngAfterViewChecked(): void {
    if (
      this.allMarkers.length !== 0 &&
      this.allMarkers.length !== this.cachedAllMarkers.length
    ) {
      console.log('no cached');
      this.allMarkers = this.markersService.getMarkers();
      this.cachedAllMarkers = this.allMarkers;
      this.markerClusterer.makeCluster();
    }
  }
  // cachedChargingValue?: number;
  // handleFilters(object: string, filter?: string, charging?: number) {
  //   if (object) {
  //     switch (object) {
  //       case 'all':
  //         this.markersService.hideExcept('');
  //         this.markerClusterer.rerenderCluster();
  //         break;
  //       case 'vehicles':
  //         this.markersService.hideExcept('vehicle');
  //         this.markersService.convertToMarkers(this.vehicles);
  //         this.markerClusterer.rerenderCluster();
  //         break;
  //       case 'parking':
  //         this.markersService.hideExcept('parking');
  //         this.markersService.convertToMarkers(this.parkings);
  //         this.markerClusterer.rerenderCluster();
  //         break;
  //       case 'info':
  //         this.markersService.hideExcept('poi');
  //         this.markerClusterer.rerenderCluster();
  //         break;
  //       default:
  //         return;
  //     }
  //   }

  //   if (filter) {
  //     switch (filter) {
  //       case 'charge': {
  //         if (charging && charging !== this.cachedChargingValue) {
  //           this.cachedChargingValue = charging;
  //           console.log(
  //             "we've charging so let's go",
  //             charging,
  //             this.cachedChargingValue
  //           );
  //           this.markersService.clearGoogleMarkers('vehicle');
  //           this.markersService
  //             .sortMarkersByCharge(charging)
  //             .then(() => this.markerClusterer.rerenderCluster());
  //           // this.markerClusterer.rerenderCluster();
  //           // this.markersService.requestNewMarkers(charging).then(() => {
  //           //   [this.vehicleMarkers, ,] =
  //           //     this.markersService.getConvertedMarkers();
  //           //   this.allMarkers = this.markersService.getMarkers();
  //           //   this.markerClusterer.rerenderCluster();
  //           //   console.log('map', this.vehicleMarkers);
  //           // });

  //           // this.dataFetchingService
  //           //   .sortByCharging(charging)
  //           //   .subscribe((vehicles) => {
  //           //     this.markersService.updateData(vehicles);
  //           //     this.markersService.convertAllToMarkers();
  //           // this.vehicles = vehicles;
  //           // this.markersService.changeMarkers(vehicles);
  //           // this.markerClusterer.rerenderCluster();
  //           // });
  //         }
  //         break;
  //       }

  //       case 'availability': {
  //         this.markersService.clearGoogleMarkers('vehicle');
  //         this.markersService.sortMarkersByAvailability();
  //         break;
  //       }

  //       default:
  //         return;
  //     }
  //   }
  // }
}
