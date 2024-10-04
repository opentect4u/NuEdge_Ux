import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialEntryComponent } from './financial-entry.component';

describe('FinancialEntryComponent', () => {
  let component: FinancialEntryComponent;
  let fixture: ComponentFixture<FinancialEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinancialEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
