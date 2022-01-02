import { Component, Input, OnInit } from '@angular/core';
import { MapService } from '../services/map.service';
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

  constructor(
    private mapService: MapService,
    private markersService: MarkersService,
    private markerClustererService: ClusterService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.mapService.createMap().then(() => {
      this.markerClustererService.initClusters();
      this.markersService.renderMarkers().then(() => {
        this.markerClustererService.makeCluster();
        this.isLoading = false;
      });
    });
  }
}
