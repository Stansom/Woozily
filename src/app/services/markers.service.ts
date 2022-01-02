import { Injectable } from '@angular/core';
import { Marker, Parking, Poi, Vehicle } from '../types';
import { DataFetchingService } from './data-fetching.service';
import { MapService } from './map.service';
import {
  distinctUntilChanged,
  lastValueFrom,
  map,
  Observable,
  Subject,
  tap,
} from 'rxjs';
import { InfoWindowService } from './info-window.service';
import { createIcon, createInfoBalloon } from '../helpers';

@Injectable({
  providedIn: 'root',
})
export class MarkersService {
  private _markers: google.maps.Marker[] = [];
  private _cachedMarkers: google.maps.Marker[] = [];
  private _infoWindow?: google.maps.InfoWindow;
  vehicleMarkers: Marker[] = [];
  parkingMarkers: Marker[] = [];
  poiMarkers: Marker[] = [];

  vehicles: Vehicle[] = [];
  parkings: Parking[] = [];
  pois: Poi[] = [];

  parkings$?: Observable<Parking[]>;
  searchParkings = new Subject<Parking[]>();

  constructor(
    private mapService: MapService,
    private dataFetchingService: DataFetchingService,
    private infoWindowService: InfoWindowService // private clustererService: ClusterService
  ) {}

  addMarker(marker: google.maps.Marker) {
    this._markers.push(marker);
  } //addMarker

  async fetchData() {
    const vehicles$ = this.dataFetchingService.getVehicles();
    const parkings$ = this.dataFetchingService.getParkings();
    this.parkings$ = parkings$;
    const pois$ = this.dataFetchingService.getPois();
    this.vehicles = await lastValueFrom(vehicles$);
    this.parkings = await lastValueFrom(parkings$);
    this.pois = await lastValueFrom(pois$);
  } //fetchData

  async renderMarkers() {
    if (this._cachedMarkers.length === 0) {
      const fetch = this.fetchData();
      fetch.then(() => {
        this.convertAllMarkers();
        this.vehicleMarkers.forEach((item) => this.createGoogleMarker(item));
        this.parkingMarkers.forEach((item) => this.createGoogleMarker(item));
        this.poiMarkers.forEach((item) => this.createGoogleMarker(item));
        this._cachedMarkers = this._markers;
      });
      return await fetch;
    }
    this._markers = this._cachedMarkers;
    this._cachedMarkers.forEach((marker) => marker.setVisible(true));
  } //renderMarkers

  createGoogleMarker(marker: Marker) {
    const newMarker = new google.maps.Marker({
      position: marker.position,
      icon: marker.icon,
      map: this.mapService.getMap(),
      title: marker.title,
    });
    this.createGoogleInfoWindow(newMarker, marker);
    this.addMarker(newMarker);
  } //createGoogleMarker

  createGoogleInfoWindow(marker: google.maps.Marker, info: Marker) {
    this._infoWindow = this.infoWindowService.createInfoWindow();
    marker.addListener('click', () => {
      if (this._infoWindow) {
        this._infoWindow?.setContent(info.info);
        this._infoWindow.open(this.mapService.getMap(), marker);
      }
    });
  } //createGoogleInfoWindow

  getMarkers(): google.maps.Marker[] {
    return this._markers;
  } //getMarkers

  convertToMarkers(object: Vehicle[] | Parking[] | Poi[]): Marker[] {
    if (!object) return [];
    let tempArray: Marker[] = [];
    object.forEach(
      (item) =>
        (tempArray = [
          ...tempArray,
          {
            position: new google.maps.LatLng(
              item.location.latitude,
              item.location.longitude
            ),
            info: createInfoBalloon(item),
            icon: createIcon(item),
            batteryLevelPct: 'status' in item ? item.batteryLevelPct : 0,
            title: item.discriminator,
          },
        ])
    );
    return tempArray;
  } //convertToMarkers

  convertAllMarkers() {
    this.vehicleMarkers.length
      ? this.vehicleMarkers
      : (this.vehicleMarkers = this.convertToMarkers(
          this.vehicles
        ) as Marker[]);
    this.parkingMarkers.length
      ? this.parkingMarkers
      : (this.parkingMarkers = this.convertToMarkers(
          this.parkings
        ) as Marker[]);
    this.poiMarkers.length
      ? this.poiMarkers
      : (this.poiMarkers = this.convertToMarkers(this.pois) as Marker[]);
  } //convertAllMarkers

  getConvertedMarkers() {
    return [this.vehicleMarkers, this.parkingMarkers, this.poiMarkers];
  } //getConvertedMarkers

  hideExcept(title: string): void {
    const filtered = this._markers.filter((marker) => {
      return marker.getTitle() !== title;
    });
    if (title === '') {
      this._markers.forEach((marker) => marker.setVisible(true));
      return;
    }
    if (this._markers.length) {
      this._markers.forEach((marker) => marker.setVisible(true));
    } else if (this._cachedMarkers.length) {
      this._cachedMarkers.forEach((marker) => marker.setVisible(true));
    }
    filtered.forEach((marker) => marker.setVisible(false));
  } //hideExcept

  updateVehicleMarkers(data: Vehicle[]) {
    const newMarkers = this._markers.filter(
      (marker) => marker.getTitle() !== 'vehicle'
    );
    this._markers.forEach((marker) => marker.setVisible(false));
    this._markers = newMarkers;

    this.vehicles = data;
    this.vehicleMarkers = this.convertToMarkers(data) as Marker[];
    this.vehicleMarkers.forEach((marker) => {
      this.createGoogleMarker(marker);
    });
    const visibleMarkers = this._markers.filter(
      (marker) => marker.getTitle() === 'vehicle'
    );

    visibleMarkers.length
      ? visibleMarkers.forEach((marker) => marker.setVisible(true))
      : this._markers.forEach((marker) => marker.setVisible(false));
  } //updateParkingMarkers

  updateParkingMarkers(data: Parking[]) {
    const newMarkers = this._markers.filter(
      (marker) => marker.getTitle() !== 'parking'
    );
    this._markers.forEach((marker) => marker.setVisible(false));
    this._markers = newMarkers;
    // this.hideExcept('parking');

    this.parkings = data;
    this.parkingMarkers = this.convertToMarkers(data) as Marker[];
    this.parkingMarkers.forEach((marker) => {
      this.createGoogleMarker(marker);
    });
    const visibleMarkers = this._markers.filter(
      (marker) => marker.getTitle() === 'parking'
    );
    visibleMarkers.length
      ? visibleMarkers.forEach((marker) => marker.setVisible(true))
      : this._markers.forEach((marker) => marker.setVisible(false));
  } //updateParkingMarkers

  async sortMarkersByCharge(charging: number) {
    const vehicles$ = this.dataFetchingService.sortByCharging(charging);
    vehicles$.subscribe((data) => {
      this.updateVehicleMarkers(data);
    });
    return await lastValueFrom(vehicles$);
  } //sortMarkersByCharge

  async sortMarkersByAvailability() {
    const vehicles$ = this.dataFetchingService.sortByAvailability();
    vehicles$.subscribe((data) => {
      this.updateVehicleMarkers(data);
    });
    return await lastValueFrom(vehicles$);
  } //sortMarkersByAvailability

  async sortParkingsByAvailability() {
    const parkings$ = this.dataFetchingService.sortParkingsByAvailability();
    parkings$.subscribe((data) => {
      this.updateParkingMarkers(data);
    });
    console.log('by aval', lastValueFrom(parkings$));
    return await lastValueFrom(parkings$);
  } //sortParkingsByAvailability

  async sortParkingsByCharger() {
    const parkings$ = this.dataFetchingService.sortParkingsByCharger();
    parkings$.subscribe((data) => {
      this.updateParkingMarkers(data);
    });
    console.log('by charging', lastValueFrom(parkings$));
    return await lastValueFrom(parkings$);
  } //sortParkingsByCharger
}
