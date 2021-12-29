import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MapService } from '../services/map.service';
import { Vehicle, Parking, ObjectType, Poi, Marker } from '../types';
import { MarkersService } from '../services/markers.service';
import { ClusterService } from '../services/cluster.service';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css'],
})
export class MapsComponent implements OnInit {
  @Input() title: string = '';
  isLoading: boolean = false;

  allMarkers: google.maps.Marker[] = [];
  cachedAllMarkers: google.maps.Marker[] = [];

  constructor(
    private mapService: MapService,
    private markersService: MarkersService,
    private markerClustererService: ClusterService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.mapService.createMap().then(() => {
      this.markersService.renderMarkers().then(() => {
        this.isLoading = false;
      });
      this.allMarkers = this.markersService.getMarkers();
      this.markerClustererService.initClusters();
    });
  }

  ngAfterViewChecked(): void {
    if (
      this.allMarkers.length !== 0 &&
      this.allMarkers.length !== this.cachedAllMarkers.length
    ) {
      this.allMarkers = this.markersService.getMarkers();
      this.cachedAllMarkers = this.allMarkers;
      this.markerClustererService.makeCluster();
    }
  }
}
