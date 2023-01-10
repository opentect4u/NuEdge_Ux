/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AMCModificationComponent } from './AMCModification.component';

describe('AMCModificationComponent', () => {
  let component: AMCModificationComponent;
  let fixture: ComponentFixture<AMCModificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AMCModificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AMCModificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
