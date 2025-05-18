import { TestBed } from '@angular/core/testing';

import { CartPageServiceService } from './cart-page-service.service';

describe('CartPageServiceService', () => {
  let service: CartPageServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartPageServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
