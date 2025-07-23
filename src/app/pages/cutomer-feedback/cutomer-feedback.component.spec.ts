import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CutomerFeedbackComponent } from './cutomer-feedback.component';

describe('CutomerFeedbackComponent', () => {
  let component: CutomerFeedbackComponent;
  let fixture: ComponentFixture<CutomerFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CutomerFeedbackComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CutomerFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
