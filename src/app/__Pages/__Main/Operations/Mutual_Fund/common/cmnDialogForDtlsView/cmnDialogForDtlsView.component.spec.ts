/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CmnDialogForDtlsViewComponent } from './cmnDialogForDtlsView.component';

describe('CmnDialogForDtlsViewComponent', () => {
  let component: CmnDialogForDtlsViewComponent;
  let fixture: ComponentFixture<CmnDialogForDtlsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmnDialogForDtlsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmnDialogForDtlsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
