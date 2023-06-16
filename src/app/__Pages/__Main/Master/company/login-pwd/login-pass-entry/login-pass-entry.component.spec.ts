import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPassEntryComponent } from './login-pass-entry.component';

describe('LoginPassEntryComponent', () => {
  let component: LoginPassEntryComponent;
  let fixture: ComponentFixture<LoginPassEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginPassEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPassEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
