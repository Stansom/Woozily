import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-filter-menu',
  templateUrl: './filter-menu.component.html',
  styleUrls: ['./filter-menu.component.css'],
})
export class FilterMenuComponent implements OnInit {
  isVisible: boolean = true;
  chargeButtonClicked: boolean = false;
  objectsFilter: 'all' | 'vehicles' | 'parking' | 'info' = 'all';
  filter: 'all' | 'charge' | 'availability' = 'all';

  @Output() allObjects = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  toggleVisibility() {
    this.isVisible = !this.isVisible;
  }
}
