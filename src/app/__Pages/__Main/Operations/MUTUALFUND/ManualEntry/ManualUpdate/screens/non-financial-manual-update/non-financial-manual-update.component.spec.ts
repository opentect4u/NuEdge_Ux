import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonFinancialManualUpdateComponent } from './non-financial-manual-update.component';

describe('NonFinancialManualUpdateComponent', () => {
  let component: NonFinancialManualUpdateComponent;
  let fixture: ComponentFixture<NonFinancialManualUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonFinancialManualUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NonFinancialManualUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
