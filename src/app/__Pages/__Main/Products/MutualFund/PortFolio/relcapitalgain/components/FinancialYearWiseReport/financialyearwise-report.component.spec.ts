import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialyearwiseReportComponent } from './financialyearwise-report.component';

describe('FinancialyearwiseReportComponent', () => {
  let component: FinancialyearwiseReportComponent;
  let fixture: ComponentFixture<FinancialyearwiseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinancialyearwiseReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialyearwiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
