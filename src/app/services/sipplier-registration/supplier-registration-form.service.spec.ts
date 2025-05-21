import { TestBed } from '@angular/core/testing';

import { SupplierRegistrationFormService } from './supplier-registration-form.service';

describe('SupplierRegistrationFormService', () => {
  let service: SupplierRegistrationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupplierRegistrationFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
