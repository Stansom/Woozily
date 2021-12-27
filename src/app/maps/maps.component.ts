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
import { LoggerService } from '../logger.service';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css'],
})
export class MapsComponent implements OnInit {
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
  markerClusterer?: MarkerClusterer;

  iconVehicle: google.maps.Symbol = {
    path: Icons.vehicleIcon,
    fillColor: this.tempObject.status === 'AVAILABLE' ? 'green' : 'red',
    fillOpacity: 0.6,
    strokeWeight: 0,
    rotation: 0,
    scale: 0.08,
  };
  iconParking: google.maps.Symbol = {
    path: Icons.parkingIcon,
    strokeColor: 'black',
    fillOpacity: 0.6,
    strokeWeight: 0,
    rotation: 0,
    scale: 0.6,
  };
  iconPoi: google.maps.Symbol = {
    path: Icons.poiIcon,
    strokeColor: 'black',
    fillOpacity: 0.6,
    strokeWeight: 0,
    rotation: 0,
    scale: 0.6,
  };

  constructor(
    private dataFetchingService: DataFetchingService,
    private mapService: MapService,
    private markersService: MarkersService,
    private logger: LoggerService
  ) {}

  ngOnInit(): void {
    this.mapService.createMap().then(() => {
      this.setLocations();
      // this.logger.log('init the map');
      this.map = this.mapService.getMap();

      if (!this.markerClusterer) {
        this.logger.log('init clusters');
        this.markerClusterer = new MarkerClusterer({
          map: this.map,
          // markers: this.allMarkers,
        });
      }
    });
  }

  // ngAfterViewChecked(): void {
  //   if (this.map && this.allMarkers.length) {
  //     this.markerClusterer?.addMarkers(this.allMarkers);
  //   }
  // }

  ngAfterViewChecked(): void {
    if (this.allMarkers.length === 0) {
      this.allMarkers = this.markersService.getMarkers();
      console.log(this.allMarkers.length);
    }
    this.pushMarkers();
  }

  pushMarkers(): void {
    if (this.map) {
      this.markerClusterer?.addMarkers(this.allMarkers);
    }
  }

  // clusterMarkers() {
  //   const map = this.map;
  //   const markers = this.markersService.getMarkers();
  //   const markerCluster = new MarkerClusterer({ map, markers });
  // }

  // getData() {
  // this.dataFetchingService.getVehicles().subscribe((data: any) => {
  //   this.vehicles = data.objects;
  //   console.log(this.vehicles);
  // });
  // }

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
    // this.objects = this.dataFetchingService.getData();
    // this.vehicles = this.objects[0] as Vehicle[];
    // console.log(this.objects);
    // console.log(this.vehicles);
  }
}
