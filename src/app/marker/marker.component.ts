import { Component, HostListener, Input, OnInit } from '@angular/core';
import { DataFetchingService } from '../services/data-fetching.service';
import { MapService } from '../services/map.service';
import { InfoWindowService } from '../services/info-window.service';
import { MarkersService } from '../services/markers.service';

import {
  ApiOptions,
  Vehicle,
  Location,
  Vehicles,
  Parking,
  Poi,
} from '../types';
import * as Icons from '../iconsFromPaths';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

type IconType =
  | string
  | google.maps.Icon
  | google.maps.Symbol
  | null
  | undefined;

@Component({
  selector: 'app-marker[object]',
  templateUrl: './marker.component.html',
  styleUrls: ['./marker.component.css'],
})
export class MarkerComponent implements OnInit {
  private _position?: google.maps.LatLngLiteral | google.maps.LatLng;
  private _object?: Vehicle | Parking | Poi;
  private _icon?: IconType;
  private _name?: string;
  private _infoWindow?: google.maps.InfoWindow;
  private map?: google.maps.Map;

  @Input() set position(
    position: google.maps.LatLngLiteral | google.maps.LatLng
  ) {
    this._position = position;
  }
  @Input() set object(object: Vehicle | Parking | Poi) {
    this._object = object;
  }
  @Input() set icon(icon: IconType) {
    this._icon = icon;
  }
  @Input() set name(name: string) {
    this._name = name;
  }

  vehicleMarkers: google.maps.Marker[] = [];
  parkingMarkers: google.maps.Marker[] = [];
  marker?: google.maps.Marker;

  constructor(
    private mapService: MapService,
    private infoWindowService: InfoWindowService,
    private markersService: MarkersService
  ) {}
  iconVehicle?: google.maps.Symbol;
  iconParking?: google.maps.Symbol;
  iconPoi?: google.maps.Symbol;
  ngOnInit(): void {
    this.iconVehicle = {
      path: Icons.vehicleIcon,
      fillColor:
        this._object !== undefined
          ? 'type' in this._object
            ? 'green'
            : 'red'
          : 'yellow',
      fillOpacity: 0.6,
      strokeWeight: 0,
      rotation: 0,
      scale: 0.08,
    };
    this.iconParking = {
      path: Icons.parkingIcon,
      strokeColor: 'black',
      fillOpacity: 0.6,
      strokeWeight: 0,
      rotation: 0,
      scale: 0.6,
    };
    this.iconPoi = {
      path: Icons.poiIcon,
      strokeColor: 'black',
      fillOpacity: 0.6,
      strokeWeight: 0,
      rotation: 0,
      scale: 0.6,
    };
    this._infoWindow = this.infoWindowService.createInfoWindow();
    this.mapService.createMap().then((data) => {
      this.map = data;
      this.createMarker(this._object?.location!);
      this.createInfoWindow(this._object!);
    });
  }

  createMarker(position: Location) {
    this.marker = new google.maps.Marker({
      position:
        new google.maps.LatLng(position.latitude, position.longitude) ||
        this._position,
      icon: this._object
        ? this._object.discriminator === 'vehicle'
          ? this.iconVehicle
          : this._object.discriminator === 'parking'
          ? this.iconParking
          : this._object.discriminator === 'poi'
          ? this.iconPoi
          : null
        : null,
      map: this.map,
      title: this._object?.discriminator,
    });
    this.markersService.addMarker(this.marker);
  }

  createInfoWindow(object: Vehicle | Parking | Poi, info?: string): void {
    const isAvailable =
      'status' in object
        ? object.status === 'AVAILABLE'
          ? true
          : false
        : false;
    const infoContent =
      'type' in object
        ? `
      <div class="${this._name}_bubble">
        <h4 class="title is-6 has-text-centered">${object.type}</h4>
        <p>Plates number: ${object.platesNumber}</p>
        <p>Car color: ${object.color}</p>
        <p>Range: ${object.rangeKm}</p>
        <p style="color: ${isAvailable ? 'green' : 'red'}">Availability: ${
            isAvailable ? 'yes' : 'no'
          }</p>
      </div>
    `
        : object.discriminator === 'poi' && 'category' in object
        ? `
        <div class="${this._name}_bubble">
          <h4 class="title is-6 has-text-centered">${object.category}:</h5>
          <h5 class="subtitle is-6 has-text-centered">${object.name}</h4>
          <p>${object.description}</p>
          </div>
  `
        : `
    <div class="${this._name}_bubble">
        <h4 class="title is-6 has-text-centered">Parking:</h4>
        <h5 class="subtitle is-6 has-text-centered"> ${object.name}</h5>
      </div>
    `;

    this.marker?.addListener('click', () => {
      if (this._infoWindow) {
        this._infoWindow?.setContent(infoContent);
        this._infoWindow.open(this.map, this.marker);
      }
    });
  }
}
