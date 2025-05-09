import { TestBed } from '@angular/core/testing';

import { FeedbackAndRatingPageService } from './feedback-and-rating-page.service';

describe('FeedbackAndRatingPageService', () => {
  let service: FeedbackAndRatingPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeedbackAndRatingPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
