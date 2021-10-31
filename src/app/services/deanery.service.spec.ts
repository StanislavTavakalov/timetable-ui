import { TestBed } from '@angular/core/testing';

import { DeaneryService } from './deanery.service';

describe('DeaneryService', () => {
  let service: DeaneryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeaneryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
