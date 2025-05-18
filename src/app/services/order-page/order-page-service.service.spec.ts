import { TestBed } from '@angular/core/testing';

import { OrderPageServiceService } from './order-page-service.service';

describe('OrderPageServiceService', () => {
  let service: OrderPageServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderPageServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
