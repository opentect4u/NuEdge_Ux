import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RcvFormRPTComponent } from './rcv-form-rpt.component';

describe('RcvFormRPTComponent', () => {
  let component: RcvFormRPTComponent;
  let fixture: ComponentFixture<RcvFormRPTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RcvFormRPTComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RcvFormRPTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
