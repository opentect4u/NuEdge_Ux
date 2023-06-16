import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialRPTComponent } from './financial-rpt.component';

describe('FinancialRPTComponent', () => {
  let component: FinancialRPTComponent;
  let fixture: ComponentFixture<FinancialRPTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinancialRPTComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialRPTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
