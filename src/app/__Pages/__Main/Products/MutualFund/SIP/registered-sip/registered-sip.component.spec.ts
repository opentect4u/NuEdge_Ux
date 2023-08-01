import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteredSIPComponent } from './registered-sip.component';

describe('RegisteredSIPComponent', () => {
  let component: RegisteredSIPComponent;
  let fixture: ComponentFixture<RegisteredSIPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisteredSIPComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisteredSIPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
