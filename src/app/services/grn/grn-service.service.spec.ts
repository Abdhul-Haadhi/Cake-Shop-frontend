import { TestBed } from '@angular/core/testing';

import { GrnServiceService } from './grn-service.service';

describe('GrnServiceService', () => {
  let service: GrnServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GrnServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
