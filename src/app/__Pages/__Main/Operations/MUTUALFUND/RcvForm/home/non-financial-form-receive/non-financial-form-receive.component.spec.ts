import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonFinancialFormReceiveComponent } from './non-financial-form-receive.component';

describe('NonFinancialFormReceiveComponent', () => {
  let component: NonFinancialFormReceiveComponent;
  let fixture: ComponentFixture<NonFinancialFormReceiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonFinancialFormReceiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NonFinancialFormReceiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
