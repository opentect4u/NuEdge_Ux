import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialAcknowledgementComponent } from './financial-acknowledgement.component';

describe('FinancialAcknowledgementComponent', () => {
  let component: FinancialAcknowledgementComponent;
  let fixture: ComponentFixture<FinancialAcknowledgementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinancialAcknowledgementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialAcknowledgementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
