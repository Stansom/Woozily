import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-filter-menu',
  templateUrl: './filter-menu.component.html',
  styleUrls: ['./filter-menu.component.css'],
})
export class FilterMenuComponent implements OnInit {
  isVisible: boolean = true;
  chargeButtonClicked: boolean = false;
  filter: 'all' | 'charge' | 'availability' = 'all';

  constructor() {}

  ngOnInit(): void {}

  toggleVisibility() {
    this.isVisible = !this.isVisible;
  }
}
