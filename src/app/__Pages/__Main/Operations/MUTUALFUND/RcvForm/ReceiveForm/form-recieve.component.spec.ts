import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRecieveComponent } from './form-recieve.component';

describe('FormRecieveComponent', () => {
  let component: FormRecieveComponent;
  let fixture: ComponentFixture<FormRecieveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormRecieveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormRecieveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
