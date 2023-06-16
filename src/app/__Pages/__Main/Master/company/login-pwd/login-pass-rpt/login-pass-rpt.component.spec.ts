import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPassRPTComponent } from './login-pass-rpt.component';

describe('LoginPassRPTComponent', () => {
  let component: LoginPassRPTComponent;
  let fixture: ComponentFixture<LoginPassRPTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginPassRPTComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPassRPTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
