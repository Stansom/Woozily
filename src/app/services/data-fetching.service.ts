import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, retry, tap } from 'rxjs/operators';
import {
  Vehicle,
  ApiOptions,
  Parking,
  Poi,
  ObjectNames,
  ObjectType,
} from '../types';

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
  vehicles?: Vehicle[];
  parkings?: Parking[];
  pois?: Poi[];

  mapObjects: (Vehicle[] | Parking[] | Poi[])[] = [];

  constructor(private http: HttpClient) {}

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }

  // fetchData<T>(endPoint: string) {
  //   const fullUrl = `${this.url}${endPoint}`;
  //   return this.http.get<T>(fullUrl).pipe(
  //     tap((_) => console.log(`fetching API ${endPoint} data `)),
  //     catchError(this.handleError('fetching from API', []))
  //   );
  // }

  fetchData<T>(endPoint: string): Observable<T[]> {
    return this.http.get<T[]>(`${this.url}${endPoint}`).pipe(
      tap((_) => console.log(`fetching ${endPoint} data from API`)),
      catchError((error) => {
        console.error(`Error while fetching ${endPoint} data from API`, error);
        throw Error("Can't get data from API");
      })
    );
  }

  getData() {
    for (let option in ApiOptions) {
      this.fetchData(option).subscribe((data: any) => {
        const unpacked = data.objects;
        switch (option) {
          case 'VEHICLE':
            this.vehicles = unpacked as Vehicle[];
            break;
          case 'PARKING':
            this.parkings = unpacked as Parking[];
            break;
          case 'POI':
            this.pois = unpacked as Poi[];
            break;
          default:
            console.error(`Can't get data`);
        }
      });
    }
  }

  // fetchData() {
  //   for (let option in ApiOptions) {
  //     this.http.get(`${this.url}${option}`).pipe(
  //       tap((data: any) => {
  //         console.log(`fetching ${option} data from API`);
  //         switch (option) {
  //           case 'VEHICLE':
  //             this.vehicles = data.objects as Vehicle[];
  //             this.mapObjects.push(this.vehicles);
  //             break;
  //           case 'PARKING':
  //             this.parkings = data.objects as Parking[];
  //             this.mapObjects.push(this.parkings);
  //             break;
  //           case 'POI':
  //             this.pois = data.objects as Poi[];
  //             this.mapObjects.push(this.pois);
  //             break;
  //           default:
  //             console.error(`Can't get data`);
  //         }
  //       }),
  //       catchError((error) => {
  //         console.error(`Error while fetching ${option} data from API`, error);
  //         throw Error("Can't get data from API");
  //       })
  //     );
  //   }
  // }

  // getData(type: string): Vehicle[] | Parking[] | Poi[] | null {
  //   switch (type) {
  //     case 'vehicle':
  //       return this.vehicles as Vehicle[];
  //     case 'parking':
  //       return this.parkings as Parking[];
  //     case 'poi':
  //       return this.pois as Poi[];
  //     default:
  //       return null;
  //   }
  // }

  // getData(): ObjectType[][] {
  //   this.fetchData();
  //   return this.mapObjects;
  // }

  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.url}${ApiOptions.VEHICLE}`).pipe(
      tap((_) => console.log('fetching data vehicles  from API')),
      catchError((error) => {
        console.error('Error while fetching data from API', error);
        throw Error("Can't get data from API");
      })
    );
  }

  getParkings(): Observable<Parking[]> {
    return this.http.get<Parking[]>(`${this.url}${ApiOptions.PARKING}`).pipe(
      tap((_) => console.log('fetching data parkings from API')),
      catchError((error) => {
        console.error('Error while fetching data from API', error);
        throw Error("Can't get data from API");
      })
    );
  }

  getPois(): Observable<Poi[]> {
    return this.http.get<Poi[]>(`${this.url}${ApiOptions.POI}`).pipe(
      tap((_) => console.log('fetching data pois from API')),
      catchError((error) => {
        console.error('Error while fetching data from API', error);
        throw Error("Can't get data from API");
      })
    );
  }
}
