/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BranchModificationComponent } from './branchModification.component';

describe('BranchModificationComponent', () => {
  let component: BranchModificationComponent;
  let fixture: ComponentFixture<BranchModificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchModificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchModificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
