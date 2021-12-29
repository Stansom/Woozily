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
  } //initClusters

  makeCluster(): void {
    if (this._map) {
      this._markerClusterer?.addMarkers(this.markerService.getMarkers());
    }
  } //makeCluster

  rerenderCluster(): void {
    const markers = this.markerService.getMarkers();
    const visibleMarkers = markers.filter((marker) => marker.getVisible());
    this._markerClusterer?.clearMarkers();

    visibleMarkers.length
      ? this._markerClusterer?.addMarkers(visibleMarkers)
      : null;
  } //rerenderCluster

  getClusterer(): MarkerClusterer {
    return this._markerClusterer!;
  } //getClusterer

  isClustererReady(): boolean {
    return this._markerClusterer ? true : false;
  } //isClustererReady
}
