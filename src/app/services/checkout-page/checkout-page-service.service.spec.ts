import { TestBed } from '@angular/core/testing';

import { CheckoutPageServiceService } from './checkout-page-service.service';

describe('CheckoutPageServiceService', () => {
  let service: CheckoutPageServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckoutPageServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
