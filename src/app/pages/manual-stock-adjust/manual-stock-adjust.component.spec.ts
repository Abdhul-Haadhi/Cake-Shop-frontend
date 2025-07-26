import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualStockAdjustComponent } from './manual-stock-adjust.component';

describe('ManualStockAdjustComponent', () => {
  let component: ManualStockAdjustComponent;
  let fixture: ComponentFixture<ManualStockAdjustComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManualStockAdjustComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManualStockAdjustComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
