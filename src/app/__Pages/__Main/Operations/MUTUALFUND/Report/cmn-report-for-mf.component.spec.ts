import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmnReportForMFComponent } from './cmn-report-for-mf.component';

describe('CmnReportForMFComponent', () => {
  let component: CmnReportForMFComponent;
  let fixture: ComponentFixture<CmnReportForMFComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmnReportForMFComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmnReportForMFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
