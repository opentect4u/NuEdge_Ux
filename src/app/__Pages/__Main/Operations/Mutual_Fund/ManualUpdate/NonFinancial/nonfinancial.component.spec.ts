import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonfinancialComponent } from './nonfinancial.component';

describe('NonfinancialComponent', () => {
  let component: NonfinancialComponent;
  let fixture: ComponentFixture<NonfinancialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonfinancialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NonfinancialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
