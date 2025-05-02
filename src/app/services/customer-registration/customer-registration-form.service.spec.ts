import { TestBed } from '@angular/core/testing';

import { CustomerRegistrationFormService } from './customer-registration-form.service';

describe('CustomerRegistrationFormService', () => {
  let service: CustomerRegistrationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerRegistrationFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
