import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonFinancialRPTComponent } from './non-financial-rpt.component';

describe('NonFinancialRPTComponent', () => {
  let component: NonFinancialRPTComponent;
  let fixture: ComponentFixture<NonFinancialRPTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonFinancialRPTComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NonFinancialRPTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
