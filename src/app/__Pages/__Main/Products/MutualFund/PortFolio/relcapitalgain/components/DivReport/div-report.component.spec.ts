import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivReportComponent } from './div-report.component';

describe('DivReportComponent', () => {
  let component: DivReportComponent;
  let fixture: ComponentFixture<DivReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DivReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DivReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
