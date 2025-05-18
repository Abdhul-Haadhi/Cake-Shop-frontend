import { TestBed } from '@angular/core/testing';

import { ProductStateServiceService } from './product-state-service.service';

describe('ProductStateServiceService', () => {
  let service: ProductStateServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductStateServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
