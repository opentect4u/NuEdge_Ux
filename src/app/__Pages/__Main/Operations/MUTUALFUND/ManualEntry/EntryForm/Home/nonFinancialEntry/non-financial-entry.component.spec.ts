import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonFinancialEntryComponent } from './non-financial-entry.component';

describe('NonFinancialEntryComponent', () => {
  let component: NonFinancialEntryComponent;
  let fixture: ComponentFixture<NonFinancialEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonFinancialEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NonFinancialEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
