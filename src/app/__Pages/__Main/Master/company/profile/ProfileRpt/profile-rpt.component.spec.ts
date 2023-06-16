import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileRptComponent } from './profile-rpt.component';

describe('ProfileRptComponent', () => {
  let component: ProfileRptComponent;
  let fixture: ComponentFixture<ProfileRptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileRptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileRptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
