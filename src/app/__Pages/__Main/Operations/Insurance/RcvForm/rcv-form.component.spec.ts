import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RcvFormComponent } from './rcv-form.component';

describe('RcvFormComponent', () => {
  let component: RcvFormComponent;
  let fixture: ComponentFixture<RcvFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RcvFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RcvFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
