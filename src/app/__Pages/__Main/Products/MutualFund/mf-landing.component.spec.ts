import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MfLandingComponent } from './mf-landing.component';

describe('MfLandingComponent', () => {
  let component: MfLandingComponent;
  let fixture: ComponentFixture<MfLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MfLandingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MfLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
