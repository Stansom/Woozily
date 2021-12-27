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

  ngOnInit(): void {
    // console.log('marker init');
    // this.map = this.mapService.getMap();
    // // this.createMarker(this.position);
    // const marker = new google.maps.Marker({
    //   position: this._position,
    // });
    // this._assertInitialized();
    // console.log(this.map);
    // marker.setMap(this.map);
    this._infoWindow = this.infoWindowService.createInfoWindow();
    this.mapService.createMap().then((data) => {
      this.map = data;
      // const marker = new google.maps.Marker({
      //   position: this._position,
      // });
      // if (this.map) {
      //   marker.setMap(this.map);
      // }
      // this.createMarker(this._position);
      this.createMarker(this._object?.location!);
      this.createInfoWindow(this._object!);
    });
  }

  // createMarker(obj: Vehicle | Parking, icon?: any): google.maps.Marker {
  //   const marker = new google.maps.Marker({
  //     position: new google.maps.LatLng(
  //       obj.location.latitude,
  //       obj.location.longitude
  //     ),
  //     map: this.map,
  //     icon: icon,
  //   });

  //   return marker;
  // }

  // createMarker(
  //   position: google.maps.LatLng | google.maps.LatLngLiteral | undefined,
  //   icon?: string | google.maps.Icon | google.maps.Symbol | null | undefined
  // ) {
  //   this.marker = new google.maps.Marker({
  //     position: position,
  //     icon: icon,
  //     map: this.map,
  //   });
  // }

  createMarker(position: Location) {
    this.marker = new google.maps.Marker({
      position:
        new google.maps.LatLng(position.latitude, position.longitude) ||
        this._position,
      icon: this._icon,
      map: this.map,
    });
    this.markersService.addMarker(this.marker);
  }

  createInfoWindow(object: Vehicle | Parking | Poi, info?: string): void {
    const isAvailable =
      'type' in object ? (object.status === 'AVAILABLE' ? true : false) : false;
    const infoContent =
      'type' in object
        ? `
      <div class="${this._name}_bubble">
        <h4 class="has-text-centered">${object.type}</h4>
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
        <h4 class="has-text-centered">Parking: ${object.name}</h4>
      </div>
    `;

    this.marker?.addListener('click', () => {
      if (this._infoWindow) {
        this._infoWindow?.setContent(infoContent);
        this._infoWindow.open(this.map, this.marker);
      }
    });
  }

  // setVehicleMarker(vehicle: Vehicle) {
  //   const infoWindow = new google.maps.InfoWindow();
  //   const isAvailable = vehicle.status === 'AVAILABLE';
  //   const infoContent = `
  //     <div class="vehicle_bubble">
  //       <h4 class="has-text-centered">${vehicle.type}</h4>
  //       <p>Plates number: ${vehicle.platesNumber}</p>
  //       <p>Car color: ${vehicle.color}</p>
  //       <p>Range: ${vehicle.rangeKm}</p>
  //       <p style="color: ${isAvailable ? 'green' : 'red'}">Availability: ${
  //     isAvailable ? 'yes' : 'no'
  //   }</p>
  //     </div>
  //   `;

  //   const iconVehicle = {
  //     path: Icons.vehicleIcon,
  //     fillColor: isAvailable ? 'green' : 'red',
  //     fillOpacity: 0.6,
  //     strokeWeight: 0,
  //     rotation: 0,
  //     scale: 0.08,
  //     anchor: new google.maps.Point(15, 30),
  //   };

  //   // const marker = this.createMarker(vehicle, iconVehicle);

  //     this.marker = new google.maps.Marker({
  //       position: new google.maps.LatLng(position.latitude, position.longitude),
  //       icon: iconVehicle,
  //       map: this.map,
  //     });

  //   marker.addListener('click', () => {
  //     // infoWindow.close();
  //     infoWindow.setContent(infoContent);
  //     infoWindow.open(marker.getMap(), marker);
  //   });

  //   this.vehicleMarkers.push(marker);

  //   return infoWindow;
  //   // return marker;
  // }
  // setParkingMarker(parking: Parking) {
  //   const infoWindow = new google.maps.InfoWindow();
  //   const infoContent = `
  //     <div class="parking_bubble">
  //       <h4 class="has-text-centered">Parking: ${parking.name}</h4>
  //     </div>
  //   `;

  //     const iconParking = {
  //       path: Icons.parkingIcon,
  //       color: 'black',
  //       fillOpacity: 0.6,
  //       strokeWeight: 0,
  //       rotation: 0,
  //       scale: 0.6,
  //       // anchor: new google.maps.Point(15, 30),
  //     };

  //     const marker = this.createMarker(parking, iconParking);

  //     marker.addListener('click', () => {
  //       // infoWindow.close();
  //       infoWindow.setContent(infoContent);
  //       infoWindow.open(marker.getMap(), marker);
  //     });

  //     this.parkingMarkers.push(marker);

  //     return infoWindow;
  //   }

  //   clusterMarkers(markers: google.maps.Marker[]) {
  //     const map = this.map;
  //     const markerCluster = new MarkerClusterer({ map, markers });
  //   }
  // }
}
