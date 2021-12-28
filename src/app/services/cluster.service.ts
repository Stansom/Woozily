import { Injectable } from '@angular/core';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { MapService } from './map.service';
import { MarkersService } from './markers.service';

@Injectable({
  providedIn: 'root',
})
export class ClusterService {
  private _map?: google.maps.Map;
  private _markerClusterer?: MarkerClusterer;

  constructor(
    private mapService: MapService,
    private markerService: MarkersService
  ) {}

  initClusters(): void {
    this.mapService.createMap().then((map) => {
      this._map = map;
      this._markerClusterer = new MarkerClusterer({
        map,
      });
    });
  }

  makeCluster(): void {
    if (this._map) {
      this._markerClusterer?.addMarkers(this.markerService.getMarkers());
    }
  }

  rerenderCluster(): void {
    this._markerClusterer?.removeMarkers(this.markerService.getMarkers());
    // this._markerClusterer?.render();
    // this._markerClusterer?.draw();

    // this._markerClusterer?.addMarkers(
    //   this.markerService
    //     .getMarkers()
    //     .filter((marker) => marker.getVisible() === true)
    // );
    // this._markerClusterer?.render();
    // this._markerClusterer?.draw();
  }

  getClusterer(): MarkerClusterer {
    return this._markerClusterer!;
  }

  isClustererReady(): boolean {
    return this._markerClusterer ? true : false;
  }
}
