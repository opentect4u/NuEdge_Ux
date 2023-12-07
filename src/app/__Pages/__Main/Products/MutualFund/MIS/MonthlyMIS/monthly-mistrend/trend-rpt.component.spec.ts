import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendRptComponent } from './trend-rpt.component';

describe('TrendRptComponent', () => {
  let component: TrendRptComponent;
  let fixture: ComponentFixture<TrendRptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrendRptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrendRptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
