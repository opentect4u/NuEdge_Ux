import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveSTPComponent } from './live-stp.component';

describe('LiveSTPComponent', () => {
  let component: LiveSTPComponent;
  let fixture: ComponentFixture<LiveSTPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiveSTPComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveSTPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
