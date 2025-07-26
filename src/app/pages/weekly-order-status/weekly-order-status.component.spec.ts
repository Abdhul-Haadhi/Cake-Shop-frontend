import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyOrderStatusComponent } from './weekly-order-status.component';

describe('WeeklyOrderStatusComponent', () => {
  let component: WeeklyOrderStatusComponent;
  let fixture: ComponentFixture<WeeklyOrderStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeklyOrderStatusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WeeklyOrderStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
