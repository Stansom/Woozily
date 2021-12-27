import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InfoWindowService {
  infoWindow?: google.maps.InfoWindow;
  constructor() {}

  createInfoWindow() {
    if (!this.infoWindow) {
      this.infoWindow = new google.maps.InfoWindow();
    }
    return this.infoWindow;
  }
}
