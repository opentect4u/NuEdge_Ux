import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveSWPComponent } from './live-swp.component';

describe('LiveSWPComponent', () => {
  let component: LiveSWPComponent;
  let fixture: ComponentFixture<LiveSWPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiveSWPComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveSWPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
