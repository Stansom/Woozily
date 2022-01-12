import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Vehicle, ApiOptions, Parking, Poi } from '../types';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataFetchingService {
  constructor(private http: HttpClient) {}

  unwrapResponse<T>(obj: any) {
    return obj['objects'] as T[];
  }

  fetchData<T>(endPoint: string): Observable<T[]> {
    return this.http.get<T[]>(`${environment.apiUri}${endPoint}`).pipe(
      map((data) => this.unwrapResponse<T>(data)),
      // map((data: any) => data.objects),
      // tap((_) => console.log(`fetching ${endPoint} data from API`)),
      catchError((error) => {
        console.error(`Error while fetching ${endPoint} data from API`, error);
        throw Error("Can't get data from API");
      })
    );
  } //fetchData

  getVehicles(): Observable<Vehicle[]> {
    return this.fetchData<Vehicle>(ApiOptions.VEHICLE);
  } //getVehicles

  getParkings(): Observable<Parking[]> {
    return this.fetchData<Parking>(ApiOptions.PARKING);
  } //getParkings

  getPois(): Observable<Poi[]> {
    return this.fetchData<Poi>(ApiOptions.POI);
  } //getPois
}
