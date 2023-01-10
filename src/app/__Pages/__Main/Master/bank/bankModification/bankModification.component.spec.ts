/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BankModificationComponent } from './bankModification.component';

describe('BankModificationComponent', () => {
  let component: BankModificationComponent;
  let fixture: ComponentFixture<BankModificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankModificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankModificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
