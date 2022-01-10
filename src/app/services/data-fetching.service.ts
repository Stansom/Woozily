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
  
  getVehicles(): Observable<Vehicle[]> {
    return this.http
      .get<Vehicle[]>(`${environment.apiUri}${ApiOptions.VEHICLE}`)
      .pipe(
        map((res: any) => res.objects),
        // tap(() => console.log('fetching vehicles data from API')),
        catchError((error) => {
          console.error('Error while fetching vehicles data from API', error);
          throw Error("Can't get data from API");
        })
      );
  } //getVehicles

  getParkings(): Observable<Parking[]> {
    return this.http
      .get<Parking[]>(`${environment.apiUri}${ApiOptions.PARKING}`)
      .pipe(
        map((res: any) => res.objects),
        tap((_) => console.log('fetching data parkings from API')),
        catchError((error) => {
          console.error('Error while fetching parkings data from API', error);
          throw Error("Can't get data from API");
        })
      );
  } //getParkings

  getPois(): Observable<Poi[]> {
    return this.http.get<Poi[]>(`${environment.apiUri}${ApiOptions.POI}`).pipe(
      map((res: any) => res.objects),
      // tap((_) => console.log('fetching data pois from API')),
      catchError((error) => {
        console.error('Error while fetching pois data from API', error);
        throw Error("Can't get data from API");
      })
    );
  } //getPois
}
