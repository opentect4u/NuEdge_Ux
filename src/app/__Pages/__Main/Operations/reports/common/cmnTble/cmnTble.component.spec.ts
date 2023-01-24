/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CmnTbleComponent } from './cmnTble.component';

describe('CmnTbleComponent', () => {
  let component: CmnTbleComponent;
  let fixture: ComponentFixture<CmnTbleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmnTbleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmnTbleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
