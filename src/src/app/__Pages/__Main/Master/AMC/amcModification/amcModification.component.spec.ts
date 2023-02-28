/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AmcModificationComponent } from './amcModification.component';

describe('AmcModificationComponent', () => {
  let component: AmcModificationComponent;
  let fixture: ComponentFixture<AmcModificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmcModificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmcModificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
