import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PincodeRPTComponent } from './pincode-rpt.component';

describe('PincodeRPTComponent', () => {
  let component: PincodeRPTComponent;
  let fixture: ComponentFixture<PincodeRPTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PincodeRPTComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PincodeRPTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
