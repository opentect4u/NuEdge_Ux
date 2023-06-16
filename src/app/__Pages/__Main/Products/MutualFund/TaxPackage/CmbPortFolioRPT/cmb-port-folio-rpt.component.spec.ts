import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmbPortFolioRptComponent } from './cmb-port-folio-rpt.component';

describe('CmbPortFolioRptComponent', () => {
  let component: CmbPortFolioRptComponent;
  let fixture: ComponentFixture<CmbPortFolioRptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmbPortFolioRptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmbPortFolioRptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
