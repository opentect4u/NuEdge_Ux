/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RNTmodificationComponent } from './RNTmodification.component';

describe('RNTmodificationComponent', () => {
  let component: RNTmodificationComponent;
  let fixture: ComponentFixture<RNTmodificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RNTmodificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RNTmodificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
