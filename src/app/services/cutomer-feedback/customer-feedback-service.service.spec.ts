import { TestBed } from '@angular/core/testing';

import { CustomerFeedbackServiceService } from './customer-feedback-service.service';

describe('CustomerFeedbackServiceService', () => {
  let service: CustomerFeedbackServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerFeedbackServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
