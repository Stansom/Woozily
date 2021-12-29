import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MapsComponent } from './maps/maps.component';
import { FilterMenuComponent } from './filter-menu/filter-menu.component';
@NgModule({
  declarations: [AppComponent, MapsComponent, FilterMenuComponent],
  imports: [BrowserModule, HttpClientModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
