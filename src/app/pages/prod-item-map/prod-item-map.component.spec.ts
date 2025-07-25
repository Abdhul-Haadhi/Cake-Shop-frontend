import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdItemMapComponent } from './prod-item-map.component';

describe('ProdItemMapComponent', () => {
  let component: ProdItemMapComponent;
  let fixture: ComponentFixture<ProdItemMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProdItemMapComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProdItemMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
