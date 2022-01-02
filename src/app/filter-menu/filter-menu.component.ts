import { Component, OnInit } from '@angular/core';
import { ClusterService } from '../services/cluster.service';
import { MarkersService } from '../services/markers.service';

@Component({
  selector: 'app-filter-menu',
  templateUrl: './filter-menu.component.html',
  styleUrls: ['./filter-menu.component.css'],
})
export class FilterMenuComponent implements OnInit {
  isVisible: boolean = true;
  chargeButtonClicked: boolean = false;
  chargingValue: number = 0;
  cachedNumber: number = 0;
  isLoading: boolean = false;
  objectsFilter: 'all' | 'vehicles' | 'parking' | 'info' = 'all';
  filter: 'all' | 'charge' | 'availability' = 'all';
  parkings: 'all' | 'charger' | 'available' = 'all';

  constructor(
    private markersService: MarkersService,
    private clustererService: ClusterService
  ) {}

  ngOnInit(): void {}

  toggleVisibility() {
    this.isVisible = !this.isVisible;
  } //toggleVisibility

  handleValueChange(bubble: HTMLSpanElement) {
    this.cachedNumber = this.chargingValue;
    this.markersService.sortMarkersByCharge(this.chargingValue).then(() => {
      this.clustererService.rerenderCluster();
    });
    bubble.style.left = `${this.chargingValue}%`;
  } //handleValueChange

  handleObjectsClicks() {
    switch (this.objectsFilter) {
      case 'all':
        this.isLoading = true;
        this.markersService.renderMarkers().then(() => {
          this.isLoading = false;
          this.clustererService.rerenderCluster();
        });
        break;
      case 'vehicles':
        this.markersService.hideExcept('vehicle');
        this.clustererService.rerenderCluster();
        break;
      case 'parking':
        this.markersService.hideExcept('parking');
        this.clustererService.rerenderCluster();
        break;
      case 'info':
        this.markersService.hideExcept('poi');
        this.clustererService.rerenderCluster();
        break;
      default:
        return;
    }
  } //handleObjectsClicks

  handleVehicleFilterClicks() {
    switch (this.filter) {
      case 'all':
        this.chargingValue = 0;
        this.isLoading = true;
        this.markersService.renderMarkers().then(() => {
          this.isLoading = false;
          this.markersService.hideExcept('vehicle');
          this.clustererService.rerenderCluster();
        });
        break;
      case 'availability':
        this.isLoading = true;
        this.markersService.sortMarkersByAvailability().then(() => {
          this.clustererService.rerenderCluster();
          this.isLoading = false;
        });
        break;
      case 'charge':
        break;
      default:
        return;
    }
  } //handleVehicleFilterClicks

  handleParkingFilter() {
    switch (this.parkings) {
      case 'all':
        this.markersService.renderMarkers().then(() => {
          this.isLoading = false;
          this.markersService.hideExcept('parking');
          this.clustererService.rerenderCluster();
        });

        break;
      case 'available':
        this.isLoading = true;
        this.markersService.sortParkingsByAvailability().then(() => {
          this.clustererService.rerenderCluster();
          this.isLoading = false;
        });
        break;
      case 'charger':
        this.isLoading = true;
        this.markersService.sortParkingsByCharger().then(() => {
          this.clustererService.rerenderCluster();
          this.isLoading = false;
        });
        break;
      default:
        return;
    }
  } //handleParkingFilter
}
