import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MapsComponent } from './maps/maps.component';
import { WaveComponent } from './wave/wave.component';
import { MarkerComponent } from './marker/marker.component';
import { FilterMenuComponent } from './filter-menu/filter-menu.component';
@NgModule({
  declarations: [
    AppComponent,
    MapsComponent,
    WaveComponent,
    MarkerComponent,
    FilterMenuComponent,
  ],
  imports: [BrowserModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
