interface Address {
  street: string;
  house: string;
  city: string;
}
interface Location {
  latitude: number;
  longitude: number;
}
interface Color {
  rgb: string;
  alpha: number;
}
interface Picture {
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
