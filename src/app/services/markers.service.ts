import { Injectable } from '@angular/core';
import { ApiOptions, Marker, Parking, Poi, Vehicle } from '../types';
import { DataFetchingService } from './data-fetching.service';
import { LoggerService } from '../services/logger.service';
import { MapService } from './map.service';
import { ClusterService } from './cluster.service';
import { delay, lastValueFrom } from 'rxjs';
import * as Icons from '../iconsFromPaths';
import { InfoWindowService } from './info-window.service';

@Injectable({
  providedIn: 'root',
})
export class MarkersService {
  private _name = 'Markers Service:';
  private _markers: google.maps.Marker[] = [];
  private _infoWindow?: google.maps.InfoWindow;
  vehicleMarkers: Marker[] = [];
  parkingMarkers: Marker[] = [];
  poiMarkers: Marker[] = [];

  vehicles: Vehicle[] = [];
  parkings: Parking[] = [];
  pois: Poi[] = [];

  constructor(
    private mapService: MapService,
    private logger: LoggerService,
    private dataFetchingService: DataFetchingService,
    private infoWindowService: InfoWindowService // private clustererService: ClusterService
  ) {}

  addMarker(marker: google.maps.Marker) {
    this._markers.push(marker);
  }

  async fetchData() {
    const vehicles$ = this.dataFetchingService.getVehicles();
    const parkings$ = this.dataFetchingService.getParkings();
    const pois$ = this.dataFetchingService.getPois();
    this.vehicles = await lastValueFrom(vehicles$);
    this.parkings = await lastValueFrom(parkings$);
    this.pois = await lastValueFrom(pois$);
  }

  renderMarkers() {
    this.fetchData().then(() => {
      this.convertAllToMarkers();
      this.vehicleMarkers.forEach((item) => this.createGoogleMarker(item));
      this.parkingMarkers.forEach((item) => this.createGoogleMarker(item));
      this.poiMarkers.forEach((item) => this.createGoogleMarker(item));
    });
  }

  createGoogleMarker(marker: Marker) {
    const newMarker = new google.maps.Marker({
      position: marker.position,
      icon: marker.icon,
      map: this.mapService.getMap(),
      title: marker.title,
    });
    this.createGoogleInfoWindow(newMarker, marker);
    this.addMarker(newMarker);
  }

  createGoogleInfoWindow(marker: google.maps.Marker, info: Marker) {
    this._infoWindow = this.infoWindowService.createInfoWindow();
    marker.addListener('click', () => {
      if (this._infoWindow) {
        this._infoWindow?.setContent(info.info);
        this._infoWindow.open(this.mapService.getMap(), marker);
      }
    });
  }

  clearGoogleMarkers(title: string) {
    const filtered = this._markers.filter(
      (marker) => marker.getTitle() !== title
    );
    // filtered.forEach((item) => item.setMap(null));
    this._markers.forEach((item) => item.setMap(null));
    filtered.forEach((item) => item.setMap(this.mapService.getMap()));
  }

  updateData(vehicles: Vehicle[]) {
    this.vehicles = vehicles;
  }

  getMarkerObjects(): [Vehicle[], Parking[], Poi[]] {
    return [
      this.vehicles as Vehicle[],
      this.parkings as Parking[],
      this.pois as Poi[],
    ];
  }

  getMarkers(): google.maps.Marker[] {
    return this._markers;
  }

  createInfoBalloon(object: Vehicle | Parking | Poi): string {
    const isAvailable =
      'status' in object
        ? object.status === 'AVAILABLE'
          ? true
          : false
        : false;
    const infoContent =
      'type' in object
        ? `
      <div class="vehicle_bubble">
        <h4 class="title is-6 has-text-centered">${object.type}</h4>
        <p>Plates number: ${object.platesNumber}</p>
        <p>Car color: ${object.color}</p>
        <p>Range: ${object.rangeKm}</p>
        <p>Charging: ${object.batteryLevelPct}</p>
        <p style="color: ${isAvailable ? 'green' : 'red'}">Availability: ${
            isAvailable ? 'yes' : 'no'
          }</p>
      </div>
    `
        : object.discriminator === 'poi' && 'category' in object
        ? `
        <div class="poi_bubble">
          <h4 class="title is-6 has-text-centered">${object.category}:</h5>
          <h5 class="subtitle is-6 has-text-centered">${object.name}</h4>
          <p>${object.description}</p>
          </div>
  `
        : 'availableSpacesCount' in object
        ? `
    <div class="parking_bubble">
        <h5 class="title is-6 has-text-centered">Parking:</h5>
        <h4 class="subtitle is-6 has-text-centered"> ${object.name}</h4>
        <p class="subtitle is-6">Free parking slots: ${
          object.availableSpacesCount
        }</p>
        ${
          object.chargers.length
            ? '<p class="subtitle is-6">Chargers: ${object.chargers}</p>'
            : ''
        }
        </div>
    `
        : '';

    return infoContent;
  }

  createIcon(object: Vehicle | Parking | Poi): google.maps.Symbol | null {
    switch (object.discriminator) {
      case 'vehicle': {
        return {
          path: Icons.vehicleIcon,
          fillColor:
            object !== undefined
              ? 'type' in object
                ? 'green'
                : 'red'
              : 'yellow',
          fillOpacity: 0.6,
          strokeWeight: 0,
          rotation: 0,
          scale: 0.08,
        };
      }
      case 'parking': {
        return {
          path: Icons.parkingIcon,
          strokeColor: 'black',
          fillOpacity: 0.6,
          strokeWeight: 0,
          rotation: 0,
          scale: 0.6,
        };
      }
      case 'poi': {
        return {
          path: Icons.poiIcon,
          strokeColor:
            object !== undefined && 'category' in object
              ? object.color.rgb
              : 'black',
          fillOpacity: 0.6,
          strokeWeight: 0,
          rotation: 0,
          scale: 0.6,
        };
      }
      default:
        return null;
    }
  }
  convertToMarkers(object: Vehicle[] | Parking[] | Poi[]): Marker[] | null {
    if (!object) return null;
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
            info: this.createInfoBalloon(item),
            icon: this.createIcon(item),
            batteryLevelPct: 'status' in item ? item.batteryLevelPct : 0,
            title: item.discriminator,
          },
        ])
    );
    // console.log(tempArray);
    return tempArray;
  }
  convertAllToMarkers() {
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
  }

  getConvertedMarkers() {
    return [this.vehicleMarkers, this.parkingMarkers, this.poiMarkers];
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
    const map = this.mapService.getMap();
    const filtered = this._markers.filter((marker) => {
      return marker.getTitle() !== title;
    });
    if (title === '') {
      this._markers.forEach((marker) => marker.setVisible(true));
      return;
    }

    this._markers.forEach((marker) => marker.setVisible(true));
    filtered.forEach((marker) => marker.setVisible(false));
    // console.log(filtered);
  }

  changeMarkers(object: Vehicle[] | Parking[] | Poi[]): void {
    if (object.length === 0) {
      this._markers.forEach((marker) => marker.setVisible(true));
      return;
    }
    // const objectTitle = object[0].discriminator;
    // const filteredMarkers = this._markers.filter(
    //   (marker) => marker.getTitle() === objectTitle
    // );
    // // this._markers = [];
    // console.log(filteredMarkers);
    // filteredMarkers.forEach((marker) => marker.setVisible(false));
    // // console.log(objectTitle, filteredMarkers, this._markers);

    // this._markers.forEach((marker) => marker.setVisible(false));
    if (this.vehicles) this.vehicles = object as Vehicle[];
  }

  async sortMarkersByCharge(charging: number) {
    if (charging === 0) return;
    const vehicles$ = this.dataFetchingService.sortByCharging(charging);
    // const filtered = this._markers.filter(
    //   (marker) => marker.getTitle() !== 'vehicle'
    // );
    // filtered.forEach((marker) => marker.setVisible(false));
    // this._markers = filtered;
    // console.log(filtered, '=', this._markers);
    vehicles$.subscribe((data) => {
      if (this.vehicles !== data) {
        this.vehicles = data;
        this.vehicleMarkers = this.convertToMarkers(data) as Marker[];
        this.vehicleMarkers.forEach((marker) =>
          this.createGoogleMarker(marker)
        );
        console.log('veh markers', this.vehicleMarkers);
      }
    });
    return await lastValueFrom(vehicles$);

    // this.dataFetchingService.sortByCharging(charging).subscribe((vehicles) => {
    //   this.vehicles = vehicles;
    //   this.convertToMarkers(this.vehicles);
    //   console.log('markers comp', this.vehicles);
    // });
  }

  async sortMarkersByAvailability() {
    const vehicles$ = this.dataFetchingService.sortByAvailability();
    vehicles$.subscribe((data) => {
      if (this.vehicles !== data) {
        this.vehicles = data;
        this.vehicleMarkers = this.convertToMarkers(data) as Marker[];
        this.vehicleMarkers.forEach((marker) =>
          this.createGoogleMarker(marker)
        );
        console.log('availabalw markers', this.vehicleMarkers);
      }
    });
    return await lastValueFrom(vehicles$);
  }
}
