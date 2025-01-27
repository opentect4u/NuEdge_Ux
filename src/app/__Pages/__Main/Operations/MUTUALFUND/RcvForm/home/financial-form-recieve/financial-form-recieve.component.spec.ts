import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialFormRecieveComponent } from './financial-form-recieve.component';

describe('FinancialFormRecieveComponent', () => {
  let component: FinancialFormRecieveComponent;
  let fixture: ComponentFixture<FinancialFormRecieveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinancialFormRecieveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialFormRecieveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
