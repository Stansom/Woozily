import { Injectable } from '@angular/core';
import { Marker, Parking, Poi, Vehicle } from '../types';
import { DataFetchingService } from './data-fetching.service';
import { MapService } from './map.service';
import { catchError, lastValueFrom, map, Observable, tap } from 'rxjs';
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
  pois$?: Observable<Poi[]>;
  vehicles$?: Observable<Vehicle[]>;

  constructor(
    private mapService: MapService,
    private dataFetchingService: DataFetchingService,
    private infoWindowService: InfoWindowService // private clustererService: ClusterService
  ) {}

  addMarker(marker: google.maps.Marker) {
    this._markers.push(marker);
    // this.mapService.map?.
  } //addMarker

  async fetchData() {
    this.vehicles$ = this.dataFetchingService.getVehicles();
    this.parkings$ = this.dataFetchingService.getParkings();
    this.pois$ = this.dataFetchingService.getPois();
    this.vehicles = await lastValueFrom(this.vehicles$);
    this.parkings = await lastValueFrom(this.parkings$);
    this.pois = await lastValueFrom(this.pois$);
  } //fetchData

  async renderMarkers() {
    this.clearAllMarkers();
    this.setAllMarkersInvisible();
    const fetch = this.fetchData();
    fetch.then(() => {
      this.convertAllMarkers();
      this.vehicleMarkers.forEach((item) => this.createGoogleMarker(item));
      this.parkingMarkers.forEach((item) => this.createGoogleMarker(item));
      this.poiMarkers.forEach((item) => this.createGoogleMarker(item));
    });
    return await fetch;
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
    this.vehicleMarkers = this.convertToMarkers(this.vehicles) as Marker[];
    this.parkingMarkers = this.convertToMarkers(this.parkings) as Marker[];
    this.poiMarkers = this.convertToMarkers(this.pois) as Marker[];
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
    this.setAllMarkersInvisible();
    this._markers = newMarkers;

    this.vehicles = data;
    this.vehicleMarkers = this.convertToMarkers(data) as Marker[];
    this.vehicleMarkers.forEach((marker) => {
      this.createGoogleMarker(marker);
    });
    const visibleMarkers = this._markers.filter(
      (marker) => marker.getTitle() === 'vehicle'
    );

    visibleMarkers.length > 0
      ? visibleMarkers.forEach((marker) => marker.setVisible(true))
      : this._markers.forEach((marker) => marker.setVisible(false));
  } //updateParkingMarkers

  updateParkingMarkers(data: Parking[]) {
    const newMarkers = this._markers.filter(
      (marker) => marker.getTitle() !== 'parking'
    );
    this.setAllMarkersInvisible();
    this.clearAllMarkers();
    this._markers = newMarkers;

    this.parkings = data;
    this.parkingMarkers = this.convertToMarkers(data) as Marker[];

    this.parkingMarkers.forEach((marker) => {
      this.createGoogleMarker(marker);
    });

    const visibleMarkers = this._markers.filter(
      (marker) => marker.getTitle() === 'parking'
    );
    visibleMarkers.length > 0
      ? visibleMarkers.forEach((marker) => marker.setVisible(true))
      : this._markers.forEach((marker) => marker.setVisible(false));
  } //updateParkingMarkers

  async sortMarkersByCharge(charging: number) {
    this.vehicles$ = this.dataFetchingService.getVehicles().pipe(
      map((vehicle: Vehicle[]) =>
        vehicle.filter((item) => item.batteryLevelPct > charging)
      ),
      // tap(() => console.log('fetching charging data from API')),
      tap((data) => this.updateVehicleMarkers(data)),

      catchError((error) => {
        console.error('Error while sorting vehicles by charging', error);
        throw Error("Can't get data from API");
      })
    );
    const promised = await lastValueFrom(this.vehicles$);
  } //sortMarkersByCharge

  async sortMarkersByAvailability() {
    this.vehicles$ = this.dataFetchingService.getVehicles().pipe(
      map((vehicle: Vehicle[]) =>
        vehicle.filter((item) => item.status === 'AVAILABLE')
      ),
      // tap(() => console.log('fetching available vehicles from API')),
      tap((data) => this.updateVehicleMarkers(data)),
      catchError((error) => {
        console.error('Error while sorting vehicles by availability', error);
        throw Error("Can't get data from API");
      })
    );

    const promised = await lastValueFrom(this.vehicles$);
  } //sortMarkersByAvailability

  async sortParkingsByAvailability() {
    this.parkings$ = this.dataFetchingService.getParkings().pipe(
      map((parking: Parking[]) =>
        parking.filter((item) => item.spacesCount > 0)
      ),
      // tap(() => console.log('fetching available parking slots from API')),
      tap((data) => this.updateParkingMarkers(data)),
      catchError((error) => {
        console.error(
          'Error while fetching parking slots by availability',
          error
        );
        throw Error("Can't get data from API");
      })
    );

    const promised = await lastValueFrom(this.parkings$);
  } //sortParkingsByAvailability

  async sortParkingsByCharger() {
    this.parkings$ = this.dataFetchingService.getParkings().pipe(
      map((parking: Parking[]) =>
        parking.filter((item) => item.chargers.length > 0)
      ),
      // tap(() =>
      //   console.log('fetching available chargers on parkings from API')
      // ),
      tap((data) => this.updateParkingMarkers(data)),
      catchError((error) => {
        console.error('Error while fetching chargers on parking slots', error);
        throw Error("Can't get data from API");
      })
    );
    this.parkings$.subscribe((data) => {
      this.updateParkingMarkers(data);
    });
    const promised = await lastValueFrom(this.parkings$);
  } //sortParkingsByCharger

  async showAllParkings() {
    this.parkings$ = this.dataFetchingService
      .getParkings()
      .pipe(tap((data) => this.updateParkingMarkers(data)));
    const promised = await lastValueFrom(this.parkings$);
  } //showAllParkings

  async showAllVehicles() {
    this.vehicles$ = this.dataFetchingService
      .getVehicles()
      .pipe(tap((data) => this.updateVehicleMarkers(data)));
    const promised = await lastValueFrom(this.vehicles$);
  } //showAllVehicles

  setAllMarkersInvisible() {
    this._markers.forEach((marker) => {
      marker.setVisible(false);
    });
  } //setAllMarkersInvisible

  clearAllMarkers() {
    this._markers.length = 0;
  } //clearAllMarkers
}
