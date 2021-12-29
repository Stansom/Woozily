export interface Address {
  street: string;
  house: string;
  city: string;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface Color {
  rgb: string;
  alpha: number;
}

export interface Picture {
  contentType?: string;
  extension?: string;
  id: string;
  name: string;
}

export interface Vehicle {
  address?: string;
  batteryLevelPct: number;
  color: Color | string;
  description?: string;
  discriminator: string;
  id: string;
  location: Location;
  locationDescription?: string;
  mapColor: Color;
  metadata?: string;
  name: string;
  picture: Picture;
  platesNumber: string;
  promotion?: string;
  rangeKm: number;
  reservation?: string;
  reservationEnd?: string;
  sideNumber: string;
  status: string;
  type: string;
}

export interface Vehicles {
  objects: Vehicle[];
}

export interface Parking {
  discriminator: string;
  address: Address;
  spacesCount: number;
  availableSpacesCount: number;
  chargers: string[];
  color: Color;
  pictureId?: string;
  id: string;
  name: string;
  description: string;
  location: Location;
  metadata?: string;
}

export interface Parkings {
  objects: Parking[];
}

export interface Poi {
  discriminator: string;
  id: string;
  name: string;
  description: string;
  location: Location;
  metadata: string;
  address: Address;
  category: string;
  picture?: string;
  color: Color;
}

export interface Pois {
  objects: Poi[];
}

export enum ApiOptions {
  VEHICLE = 'VEHICLE',
  POI = 'POI',
  PARKING = 'PARKING',
}

export type ObjectNames = 'vehicle' | 'parking' | 'poi';
export type ObjectType = Vehicle | Parking | Poi;

export interface Marker {
  position: google.maps.LatLng | google.maps.LatLngLiteral;
  info: string;
  icon: google.maps.Symbol | null;
  batteryLevelPct: number;
  title: string;
}
