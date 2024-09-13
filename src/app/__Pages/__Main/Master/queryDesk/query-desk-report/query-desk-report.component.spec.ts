import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryDeskReportComponent } from './query-desk-report.component';

describe('QueryDeskReportComponent', () => {
  let component: QueryDeskReportComponent;
  let fixture: ComponentFixture<QueryDeskReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueryDeskReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryDeskReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
