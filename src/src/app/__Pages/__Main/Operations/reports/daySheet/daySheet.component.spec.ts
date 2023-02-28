/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DaySheetComponent } from './daySheet.component';

describe('DaySheetComponent', () => {
  let component: DaySheetComponent;
  let fixture: ComponentFixture<DaySheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DaySheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DaySheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
