import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AumReportTotalCalcComponent } from './aum-report-total-calc.component';

describe('AumReportTotalCalcComponent', () => {
  let component: AumReportTotalCalcComponent;
  let fixture: ComponentFixture<AumReportTotalCalcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AumReportTotalCalcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AumReportTotalCalcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
