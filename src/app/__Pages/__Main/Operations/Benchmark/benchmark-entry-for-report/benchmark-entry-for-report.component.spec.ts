import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BenchmarkEntryForReportComponent } from './benchmark-entry-for-report.component';

describe('BenchmarkEntryForReportComponent', () => {
  let component: BenchmarkEntryForReportComponent;
  let fixture: ComponentFixture<BenchmarkEntryForReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BenchmarkEntryForReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BenchmarkEntryForReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
