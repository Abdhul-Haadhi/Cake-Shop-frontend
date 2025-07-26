import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlySalesIncomeComponent } from './monthly-sales-income.component';

describe('MonthlySalesIncomeComponent', () => {
  let component: MonthlySalesIncomeComponent;
  let fixture: ComponentFixture<MonthlySalesIncomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlySalesIncomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MonthlySalesIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
