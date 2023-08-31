import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertCtrlComponent } from './alert-ctrl.component';

describe('AlertCtrlComponent', () => {
  let component: AlertCtrlComponent;
  let fixture: ComponentFixture<AlertCtrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertCtrlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertCtrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
