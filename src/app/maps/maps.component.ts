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
  tempObject: Vehicle = {
    discriminator: 'vehicle',
    platesNumber: 'WZPV001',
    sideNumber: 'Z3-PVAN-01',
    color: 'White',
    type: 'TRUCK',
    picture: {
      id: 'e7ace1de-ab7f-4120-922d-23441a041bd9',
      name: 'e7ace1de-ab7f-4120-922d-23441a041bd9',
    },
    rangeKm: 193,
    batteryLevelPct: 98,
    status: 'AVAILABLE',
    mapColor: { rgb: 'ffffff', alpha: 0.5 },
    id: '00000000-0000-0000-0005-000000000003',
    name: 'Enigma Python Van',
    location: {
      latitude: 52.1935161702226,
      longitude: 20.9304286193486,
    },
  };
  map?: google.maps.Map;
  vehicles: Vehicle[] = [];
  parkings: Parking[] = [];
  pois: Poi[] = [];
  objects?: ObjectType[][] = [];
  // vehicleMarkers: google.maps.Marker[] = [];
  // parkingMarkers: google.maps.Marker[] = [];

  allMarkers: google.maps.Marker[] = [];

  constructor(
    private dataFetchingService: DataFetchingService,
    private mapService: MapService,
    private markersService: MarkersService,
    private logger: LoggerService,
    private markerClusterer: ClusterService
  ) {}

  ngOnInit(): void {
    this.mapService.createMap().then(() => {
      this.setLocations();
      this.map = this.mapService.getMap();
      this.markerClusterer.initClusters();
    });
  }

  ngAfterViewChecked(): void {
    if (this.allMarkers.length === 0) {
      this.allMarkers = this.markersService.getMarkers();
    }

    // do {
    //   console.log('making clusterer');
    // } while (this.markerClusterer.isClustererReady() === false);
    if (this.allMarkers.length > 0) {
      // console.log('making clusterer');
      // setTimeout(() => {
      //   console.log('making clusterer');
      //   this.markerClusterer.makeCluster();
      // }, 1000);
      //   this.markerClusterer.makeCluster();
    }

    if (this.markerClusterer) {
      // console.log('making clusterer');
    }
  }

  setLocations() {
    this.dataFetchingService.getVehicles().subscribe((data: any) => {
      const unpackedData = data.objects;
      this.vehicles = unpackedData;
    });
    this.dataFetchingService.getParkings().subscribe((data: any) => {
      const unpackedData = data.objects;
      this.parkings = unpackedData;
    });
    this.dataFetchingService.getPois().subscribe((data: any) => {
      const unpackedData = data.objects;
      this.pois = unpackedData;
    });
  }

  handleFilters(event: string) {
    if (event.length > 0) {
      const tempVehicles = [...this.vehicles];
      const tempParkings = [...this.parkings];
      const tempPois = [...this.pois];
      switch (event) {
        case 'all':
          this.markersService.hideExcept('');
          this.markerClusterer.rerenderCluster();
          break;
        case 'vehicles':
          this.markersService.hideExcept('vehicle');
          this.markerClusterer.rerenderCluster();
          break;
        case 'parking':
          this.markersService.hideExcept('parking');
          this.markerClusterer.rerenderCluster();
          break;
        case 'info':
          this.markersService.hideExcept('poi');
          this.markerClusterer.rerenderCluster();
          break;
        default:
          this.logger.log('no event to handle');
      }
      console.log(event);
    }
  }
}
