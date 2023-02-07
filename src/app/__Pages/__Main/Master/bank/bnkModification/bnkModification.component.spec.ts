/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BnkModificationComponent } from './bnkModification.component';

describe('BnkModificationComponent', () => {
  let component: BnkModificationComponent;
  let fixture: ComponentFixture<BnkModificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BnkModificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BnkModificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
