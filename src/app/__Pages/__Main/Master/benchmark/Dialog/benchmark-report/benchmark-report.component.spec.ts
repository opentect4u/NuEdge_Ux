import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BenchmarkReportComponent } from './benchmark-report.component';

describe('BenchmarkReportComponent', () => {
  let component: BenchmarkReportComponent;
  let fixture: ComponentFixture<BenchmarkReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BenchmarkReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BenchmarkReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
