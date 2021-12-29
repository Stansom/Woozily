import { Injectable } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';

const API_KEY = 'AIzaSyAts9Xbep-5hDLqzkNe8hKCEJANLX47E8c';
const CENTER = { lat: 51.1079, lng: 17.0385 };
const ZOOM = 12;
const INJECT_ID = 'map';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  map?: google.maps.Map;
  constructor() {}

  async createMap() {
    if (!this.map) {
      const loader = new Loader({
        apiKey: API_KEY,
      });
      await loader.load().then(() => {
        this.map = new google.maps.Map(
          document.getElementById(INJECT_ID) as HTMLElement,
          {
            center: CENTER,
            zoom: ZOOM,
          }
        );
      });
    }
    return this.map;
  }

  getMap() {
    if (this.map) {
      return this.map;
    }
    throw Error("Map Service: Can't get a Google Map");
  }
}
