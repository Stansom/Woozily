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

type IconType =
  | string
  | google.maps.Icon
  | google.maps.Symbol
  | null
  | undefined;

@Component({
  selector: 'app-marker',
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
  private _info?: string;

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

  @Input() set info(info: string) {
    this._info = info;
  }

  vehicleMarkers: google.maps.Marker[] = [];
  parkingMarkers: google.maps.Marker[] = [];
  marker?: google.maps.Marker;

  constructor(
    private mapService: MapService,
    private infoWindowService: InfoWindowService,
    private markersService: MarkersService
  ) {}

  ngOnInit(): void {
    this._infoWindow = this.infoWindowService.createInfoWindow();
    this.mapService.createMap().then((data) => {
      this.map = data;
      this.createMarker(this._position);
      this.createInfoWindow(this._object!);
    });
  }

  createMarker(
    position: google.maps.LatLngLiteral | google.maps.LatLng | undefined
  ) {
    this.marker = new google.maps.Marker({
      position: position || this._position,
      icon: this._icon,
      map: this.map,
      title: this._name,
    });
    this.markersService.addMarker(this.marker);
  }

  createInfoWindow(object: Vehicle | Parking | Poi, info?: string): void {
    this.marker?.addListener('click', () => {
      if (this._infoWindow) {
        this._infoWindow?.setContent(this._info);
        this._infoWindow.open(this.map, this.marker);
      }
    });
  }
}
