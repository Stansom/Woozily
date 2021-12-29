import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MapsComponent } from './maps/maps.component';
import { MarkerComponent } from './marker/marker.component';
import { FilterMenuComponent } from './filter-menu/filter-menu.component';
import { ChargePipe } from './pipes/charge.pipe';
@NgModule({
  declarations: [
    AppComponent,
    MapsComponent,
    MarkerComponent,
    FilterMenuComponent,
    ChargePipe,
  ],
  imports: [BrowserModule, HttpClientModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
