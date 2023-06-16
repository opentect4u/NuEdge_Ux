/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { KyModificationComponent } from './kyModification.component';

describe('KyModificationComponent', () => {
  let component: KyModificationComponent;
  let fixture: ComponentFixture<KyModificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KyModificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KyModificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
