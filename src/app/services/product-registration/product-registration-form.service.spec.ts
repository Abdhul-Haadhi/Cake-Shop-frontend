import { TestBed } from '@angular/core/testing';

import { ProductRegistrationFormService } from './product-registration-form.service';

describe('ProductRegistrationFormService', () => {
  let service: ProductRegistrationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductRegistrationFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
