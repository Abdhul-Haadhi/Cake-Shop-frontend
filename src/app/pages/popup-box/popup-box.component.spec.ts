import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupBoxComponent } from './popup-box.component';

describe('PopupBoxComponent', () => {
  let component: PopupBoxComponent;
  let fixture: ComponentFixture<PopupBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupBoxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopupBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
