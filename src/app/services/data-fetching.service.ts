import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';
import { Vehicle, ApiOptions, Parking, Poi } from '../types';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataFetchingService {
  constructor(private http: HttpClient) {}

  fetchData<T>(endPoint: string): Observable<T[]> {
    return this.http.get<T[]>(`${environment.apiUri}${endPoint}`).pipe(
      map((data: any) => data.objects),
      // tap((_) => console.log(`fetching ${endPoint} data from API`)),
      catchError((error) => {
        console.error(`Error while fetching ${endPoint} data from API`, error);
        throw Error("Can't get data from API");
      })
    );
  } //fetchData

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
        // tap((_) => console.log('fetching data parkings from API')),
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

  sortByCharging(charge: number) {
    return this.http
      .get<Vehicle[]>(`${environment.apiUri}${ApiOptions.VEHICLE}`)
      .pipe(
        map((res: any) => res.objects),
        map((vehicle: Vehicle[]) =>
          vehicle.filter((item) => item.batteryLevelPct > charge)
        ),
        // tap(() => console.log('fetching charging data from API')),
        catchError((error) => {
          console.error('Error while sorting vehicles by charging', error);
          throw Error("Can't get data from API");
        })
      );
  } //sortByCharging

  sortByAvailability() {
    return this.http
      .get<Vehicle[]>(`${environment.apiUri}${ApiOptions.VEHICLE}`)
      .pipe(
        map((res: any) => res.objects),
        map((vehicle: Vehicle[]) =>
          vehicle.filter((item) => item.status === 'AVAILABLE')
        ),
        // tap(() => console.log('fetching available vehicles from API')),
        catchError((error) => {
          console.error('Error while sorting vehicles by availability', error);
          throw Error("Can't get data from API");
        })
      );
  } //sortByAvailability

  sortParkingsByAvailability() {
    return this.http
      .get<Parking[]>(`${environment.apiUri}${ApiOptions.PARKING}`)
      .pipe(
        map((res: any) => res.objects),
        map((parking: Parking[]) =>
          parking.filter((item) => item.spacesCount > 0)
        ),
        // tap(() => console.log('fetching available parking slots from API')),
        catchError((error) => {
          console.error(
            'Error while fetching parking slots by availability',
            error
          );
          throw Error("Can't get data from API");
        })
      );
  } //sortParkingsByAvailability

  sortParkingsByCharger() {
    return this.http
      .get<Parking[]>(`${environment.apiUri}${ApiOptions.PARKING}`)
      .pipe(
        map((res: any) => res.objects),
        map((parking: Parking[]) =>
          parking.filter((item) => item.chargers.length > 0)
        ),
        // tap(() =>
        //   console.log('fetching available chargers on parkings from API')
        // ),
        catchError((error) => {
          console.error(
            'Error while fetching chargers on parking slots',
            error
          );
          throw Error("Can't get data from API");
        })
      );
  } //sortParkingsByCharger
}
