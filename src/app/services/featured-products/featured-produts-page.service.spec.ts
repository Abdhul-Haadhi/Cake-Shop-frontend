import { TestBed } from '@angular/core/testing';

import { FeaturedProdutsPageService } from './featured-produts-page.service';

describe('FeaturedProdutsPageService', () => {
  let service: FeaturedProdutsPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeaturedProdutsPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
