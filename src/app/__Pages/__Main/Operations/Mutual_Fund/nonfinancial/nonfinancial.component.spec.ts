/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NonfinancialComponent } from './nonfinancial.component';

describe('NonfinancialComponent', () => {
  let component: NonfinancialComponent;
  let fixture: ComponentFixture<NonfinancialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NonfinancialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonfinancialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
