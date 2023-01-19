/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NFOComponent } from './NFO.component';

describe('NFOComponent', () => {
  let component: NFOComponent;
  let fixture: ComponentFixture<NFOComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NFOComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NFOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
