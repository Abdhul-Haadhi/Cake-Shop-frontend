import { TestBed } from '@angular/core/testing';

import { EmployeeRegistrationFormService } from './employee-registration-form.service';

describe('EmployeeRegistrationFormService', () => {
  let service: EmployeeRegistrationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeRegistrationFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
