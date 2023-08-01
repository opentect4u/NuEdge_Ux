import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteredSwpComponent } from './registered-swp.component';

describe('RegisteredSwpComponent', () => {
  let component: RegisteredSwpComponent;
  let fixture: ComponentFixture<RegisteredSwpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisteredSwpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisteredSwpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
