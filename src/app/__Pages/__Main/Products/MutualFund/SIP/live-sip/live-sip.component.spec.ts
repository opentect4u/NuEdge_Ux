import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveSIPComponent } from './live-sip.component';

describe('LiveSIPComponent', () => {
  let component: LiveSIPComponent;
  let fixture: ComponentFixture<LiveSIPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiveSIPComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveSIPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
