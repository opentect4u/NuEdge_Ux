/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RntModificationComponent } from './rntModification.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { SnkbarModule } from 'src/app/__Core/snkbar/snkbar.module';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'src/app/shared/shared.module';

describe('RntModificationComponent', () => {
  let component: RntModificationComponent;
  let fixture: ComponentFixture<RntModificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RntModificationComponent ],
      imports:[MatDialogModule,RouterTestingModule,
        SnkbarModule,
        HttpClientModule,
        MatIconModule,
        SharedModule
      ],
      providers: [
        {provide: MatDialogRef, useValue: {}},
        {provide: MAT_DIALOG_DATA, useValue: []},
    ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RntModificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check Security Qestion answer',() =>{
    expect(component.addSecurityQuesAns(undefined));
  })

});
