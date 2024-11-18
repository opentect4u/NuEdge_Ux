import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonfinancialAcknowledgementComponent } from './nonfinancial-acknowledgement.component';

describe('NonfinancialAcknowledgementComponent', () => {
  let component: NonfinancialAcknowledgementComponent;
  let fixture: ComponentFixture<NonfinancialAcknowledgementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonfinancialAcknowledgementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NonfinancialAcknowledgementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
