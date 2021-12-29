import { Pipe, PipeTransform } from '@angular/core';
import { Marker, Vehicle } from '../types';

@Pipe({
  name: 'charge',
  pure: true,
})
export class ChargePipe implements PipeTransform {
  transform(value: Marker[], charging = '0'): Marker[] {
    const filtered = value.filter(
      (item) => item.batteryLevelPct > Number(charging)
    );
    return filtered;
  }
}
