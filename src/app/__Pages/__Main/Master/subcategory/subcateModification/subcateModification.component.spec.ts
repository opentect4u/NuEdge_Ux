/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SubcateModificationComponent } from './subcateModification.component';

describe('SubcateModificationComponent', () => {
  let component: SubcateModificationComponent;
  let fixture: ComponentFixture<SubcateModificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubcateModificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubcateModificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
