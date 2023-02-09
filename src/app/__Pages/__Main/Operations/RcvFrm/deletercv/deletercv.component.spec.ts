/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DeletercvComponent } from './deletercv.component';

describe('DeletercvComponent', () => {
  let component: DeletercvComponent;
  let fixture: ComponentFixture<DeletercvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeletercvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletercvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
