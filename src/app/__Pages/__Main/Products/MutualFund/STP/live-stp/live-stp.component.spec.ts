import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveStpComponent } from './live-stp.component';

describe('LiveStpComponent', () => {
  let component: LiveStpComponent;
  let fixture: ComponentFixture<LiveStpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiveStpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveStpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
