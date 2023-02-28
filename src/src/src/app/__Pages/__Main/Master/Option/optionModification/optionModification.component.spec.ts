/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { OptionModificationComponent } from './optionModification.component';

describe('OptionModificationComponent', () => {
  let component: OptionModificationComponent;
  let fixture: ComponentFixture<OptionModificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionModificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionModificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
