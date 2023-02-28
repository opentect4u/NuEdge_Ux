/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ScmRptComponent } from './scmRpt.component';

describe('ScmRptComponent', () => {
  let component: ScmRptComponent;
  let fixture: ComponentFixture<ScmRptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScmRptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScmRptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
