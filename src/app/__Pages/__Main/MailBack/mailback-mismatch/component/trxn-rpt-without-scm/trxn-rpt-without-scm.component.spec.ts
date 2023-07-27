import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrxnRptWithoutScmComponent } from './trxn-rpt-without-scm.component';

describe('TrxnRptWithoutScmComponent', () => {
  let component: TrxnRptWithoutScmComponent;
  let fixture: ComponentFixture<TrxnRptWithoutScmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrxnRptWithoutScmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrxnRptWithoutScmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
