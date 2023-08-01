import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteredStpComponent } from './registered-stp.component';

describe('RegisteredStpComponent', () => {
  let component: RegisteredStpComponent;
  let fixture: ComponentFixture<RegisteredStpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisteredStpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisteredStpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
