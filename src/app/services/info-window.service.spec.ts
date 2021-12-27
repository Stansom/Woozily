import { TestBed } from '@angular/core/testing';

import { InfoWindowService } from './info-window.service';

describe('InfoWindowService', () => {
  let service: InfoWindowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InfoWindowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
