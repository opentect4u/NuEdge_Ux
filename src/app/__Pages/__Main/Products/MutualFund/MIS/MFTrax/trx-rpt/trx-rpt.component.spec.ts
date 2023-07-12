import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrxRptComponent } from './trx-rpt.component';

describe('TrxRptComponent', () => {
  let component: TrxRptComponent;
  let fixture: ComponentFixture<TrxRptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrxRptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrxRptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
