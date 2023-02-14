/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { createClientComponent } from './createClient.component';

// import { ClModifcationComponent } from './clModifcation.component';

describe('ClModifcationComponent', () => {
  let component: createClientComponent;
  let fixture: ComponentFixture<createClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ createClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(createClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
