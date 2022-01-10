import { Parking, Poi, Vehicle, isVehicle, isPoi, isParking } from './types';
import * as Icons from './iconsFromPaths';

export function createInfoBalloon(object: Vehicle | Parking | Poi): string {
  const isAvailable =
    'status' in object && (object.status === 'AVAILABLE' ? true : false);
  const infoContent =
    //checking for vehicle
    // 'type' in object
    isVehicle(object)
      ? `
    <div class="vehicle_bubble">
      <h4 class="title is-6 has-text-centered">${object.type}</h4>
      <p>Plates number: ${object.platesNumber}</p>
      <p>Car color: ${object.color}</p>
      <p>Range: ${object.rangeKm}</p>
      <p>Charging: ${object.batteryLevelPct}</p>
      <p style="color: ${isAvailable ? 'green' : 'red'}">Availability: ${
          isAvailable ? 'yes' : 'no'
        }</p>
    </div>
  `
      : //checking for poi
      // object.discriminator === 'poi' && 'category' in object
      isPoi(object)
      ? `
      <div class="poi_bubble">
        <h4 class="title is-6 has-text-centered">${object.category}:</h5>
        <h5 class="subtitle is-6 has-text-centered">${object.name}</h4>
        <p>${object.description}</p>
        </div>
`
      : //checking for parking
      // 'availableSpacesCount' in object
      isParking(object)
      ? `
  <div class="parking_bubble">
      <h5 class="title is-6 has-text-centered">Parking:</h5>
      <h4 class="subtitle is-6 has-text-centered"> ${object.name}</h4>
      <p class="subtitle is-6">Full address: ${object.address.street}, ${
          object.address.house
        }</p>
      <p class="subtitle is-6">Free parking slots: ${
        object.availableSpacesCount
      }</p>
      ${
        object.chargers.length
          ? `<p class="subtitle is-6">Chargers: ${object.chargers.length}</p>`
          : ''
      }
      </div>
  `
      : '';

  return infoContent;
} //createInfoBalloon

export function createIcon(
  object: Vehicle | Parking | Poi
): google.maps.Symbol | null {
  switch (object.discriminator) {
    case 'vehicle': {
      return {
        path: Icons.vehicleIcon,
        fillColor: object && 'type' in object ? 'green' : 'red',
        fillOpacity: 0.6,
        strokeWeight: 0,
        rotation: 0,
        scale: 0.08,
      };
    }
    case 'parking': {
      return {
        path: Icons.parkingIcon,
        strokeColor: 'black',
        fillOpacity: 0.6,
        strokeWeight: 0,
        rotation: 0,
        scale: 0.6,
      };
    }
    case 'poi': {
      return {
        path: Icons.poiIcon,
        strokeColor:
          object && 'category' in object ? object.color.rgb : 'black',
        fillOpacity: 0.6,
        strokeWeight: 0,
        rotation: 0,
        scale: 0.6,
      };
    }
    default:
      return null;
  }
} //createIcon
