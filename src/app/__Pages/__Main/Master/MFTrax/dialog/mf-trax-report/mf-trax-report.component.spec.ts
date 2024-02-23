import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MfTraxReportComponent } from './mf-trax-report.component';

describe('MfTraxReportComponent', () => {
  let component: MfTraxReportComponent;
  let fixture: ComponentFixture<MfTraxReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MfTraxReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MfTraxReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
