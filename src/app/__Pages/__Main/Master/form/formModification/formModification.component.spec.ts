/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FormModificationComponent } from './formModification.component';

describe('FormModificationComponent', () => {
  let component: FormModificationComponent;
  let fixture: ComponentFixture<FormModificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormModificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormModificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
