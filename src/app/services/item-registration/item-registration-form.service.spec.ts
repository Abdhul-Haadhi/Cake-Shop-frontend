import { TestBed } from '@angular/core/testing';

import { ItemRegistrationFormService } from './item-registration-form.service';

describe('ItemRegistrationFormService', () => {
  let service: ItemRegistrationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemRegistrationFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
