import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PincodeEntryComponent } from './pincode-entry.component';

describe('PincodeEntryComponent', () => {
  let component: PincodeEntryComponent;
  let fixture: ComponentFixture<PincodeEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PincodeEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PincodeEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
