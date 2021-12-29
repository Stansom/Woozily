import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, delay, map, tap } from 'rxjs/operators';
import { Vehicle, ApiOptions, Parking, Poi } from '../types';

@Injectable({
  providedIn: 'root',
})
export class DataFetchingService {
  private httpOptions = {
    headers: new HttpHeaders({
      Accept: '*/*',
      'content-type': 'application/json',
      Host: 'dev.vozilla.pl',
      Connection: 'keep-alive',
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36',
      'x-ctx-organization-id': '38c6047f-d9fd-496b-b4d6-27785499c6d7',
    }),
  };
  private url = 'https://dev.vozilla.pl/api-client-portal/map?objectType=';

  constructor(private http: HttpClient) {}

  fetchData<T>(endPoint: string): Observable<T[]> {
    return this.http.get<T[]>(`${this.url}${endPoint}`).pipe(
      map((data: any) => data.objects),
      // tap((_) => console.log(`fetching ${endPoint} data from API`)),
      catchError((error) => {
        console.error(`Error while fetching ${endPoint} data from API`, error);
        throw Error("Can't get data from API");
      })
    );
  } //fetchData

  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.url}${ApiOptions.VEHICLE}`).pipe(
      map((res: any) => res.objects),
      // tap(() => console.log('fetching vehicles data from API')),
      catchError((error) => {
        console.error('Error while fetching vehicles data from API', error);
        throw Error("Can't get data from API");
      })
    );
  } //getVehicles

  getParkings(): Observable<Parking[]> {
    return this.http.get<Parking[]>(`${this.url}${ApiOptions.PARKING}`).pipe(
      map((res: any) => res.objects),
      // tap((_) => console.log('fetching data parkings from API')),
      catchError((error) => {
        console.error('Error while fetching parkings data from API', error);
        throw Error("Can't get data from API");
      })
    );
  } //getParkings

  getPois(): Observable<Poi[]> {
    return this.http.get<Poi[]>(`${this.url}${ApiOptions.POI}`).pipe(
      map((res: any) => res.objects),
      // tap((_) => console.log('fetching data pois from API')),
      catchError((error) => {
        console.error('Error while fetching pois data from API', error);
        throw Error("Can't get data from API");
      })
    );
  } //getPois

  sortByCharging(charge: number) {
    return this.http.get<Vehicle[]>(`${this.url}${ApiOptions.VEHICLE}`).pipe(
      // delay(100),
      map((res: any) => res.objects),
      // distinctUntilChanged((prev, cur) => {
      //   return prev.length === cur.length;
      // }),
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
    return this.http.get<Vehicle[]>(`${this.url}${ApiOptions.VEHICLE}`).pipe(
      delay(100),
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
    return this.http.get<Parking[]>(`${this.url}${ApiOptions.PARKING}`).pipe(
      // delay(100),

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
    return this.http.get<Parking[]>(`${this.url}${ApiOptions.PARKING}`).pipe(
      map((res: any) => res.objects),
      map((parking: Parking[]) =>
        parking.filter((item) => item.chargers.length > 0)
      ),
      // tap(() =>
      //   console.log('fetching available chargers on parkings from API')
      // ),
      catchError((error) => {
        console.error('Error while fetching chargers on parking slots', error);
        throw Error("Can't get data from API");
      })
    );
  } //sortParkingsByCharger
}
