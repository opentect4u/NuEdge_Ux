import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialManualUpdateComponent } from './financial-manual-update.component';

describe('FinancialManualUpdateComponent', () => {
  let component: FinancialManualUpdateComponent;
  let fixture: ComponentFixture<FinancialManualUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinancialManualUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialManualUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
