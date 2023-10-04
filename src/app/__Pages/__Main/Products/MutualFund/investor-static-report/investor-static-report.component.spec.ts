import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestorStaticReportComponent } from './investor-static-report.component';

describe('InvestorStaticReportComponent', () => {
  let component: InvestorStaticReportComponent;
  let fixture: ComponentFixture<InvestorStaticReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestorStaticReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestorStaticReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
