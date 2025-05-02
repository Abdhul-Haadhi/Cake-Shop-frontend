import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemRegistrationComponent } from './item-registration.component';

describe('ItemRegistrationComponent', () => {
  let component: ItemRegistrationComponent;
  let fixture: ComponentFixture<ItemRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemRegistrationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ItemRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
