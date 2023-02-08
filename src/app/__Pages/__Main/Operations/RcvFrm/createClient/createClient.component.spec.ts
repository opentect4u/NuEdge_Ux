/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ClModifcationComponent } from './clModifcation.component';

describe('ClModifcationComponent', () => {
  let component: ClModifcationComponent;
  let fixture: ComponentFixture<ClModifcationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClModifcationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClModifcationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
