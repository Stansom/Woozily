import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';

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
  objectsFilter: 'all' | 'vehicles' | 'parking' | 'info' = 'all';
  filter: 'all' | 'charge' | 'availability' = 'all';

  @Output() allObjects = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  toggleVisibility() {
    this.isVisible = !this.isVisible;
  }

  handleValueChange(bubble: HTMLSpanElement) {
    if (this.cachedNumber === this.chargingValue) {
      return;
    }
    this.cachedNumber = this.chargingValue;
    bubble.style.left = `${this.cachedNumber}%`;
    console.log(this.chargingValue);
  }
}
