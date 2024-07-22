import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValuationRptDownloadLinkComponent } from './valuation-rpt-download-link.component';

describe('ValuationRptDownloadLinkComponent', () => {
  let component: ValuationRptDownloadLinkComponent;
  let fixture: ComponentFixture<ValuationRptDownloadLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValuationRptDownloadLinkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValuationRptDownloadLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
