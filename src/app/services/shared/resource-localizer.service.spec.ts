import { TestBed } from '@angular/core/testing';

import { ResourceLocalizerService } from './resource-localizer.service';

describe('ResourceLocalizerService', () => {
  let service: ResourceLocalizerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResourceLocalizerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
