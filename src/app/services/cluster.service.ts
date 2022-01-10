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
    const markerPromise = new Promise((res: any) => {
      console.log(res);
      return (res = this.markerService.getMarkers());
    });

    markerPromise.then((data: any) => {
      console.log(data);
      const visibleMarkers = data.filter((marker: google.maps.Marker) =>
        marker.getVisible()
      );
      this._markerClusterer?.clearMarkers();
      console.log(visibleMarkers);

      visibleMarkers.length &&
        this._markerClusterer?.addMarkers(visibleMarkers);
    });

    // const visibleMarkers = markers.filter((marker) => marker.getVisible());
    // this._markerClusterer?.clearMarkers();
    // console.log(visibleMarkers);

    // visibleMarkers.length && this._markerClusterer?.addMarkers(visibleMarkers);
  } //rerenderCluster

  getClusterer(): MarkerClusterer | undefined {
    return this._markerClusterer;
  } //getClusterer

  isClustererReady(): boolean {
    return this._markerClusterer ? true : false;
  } //isClustererReady
}
