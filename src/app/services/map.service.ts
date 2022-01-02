import { Injectable } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { environment } from '../../environments/environment';

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
        apiKey: environment.googleApiKey,
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
