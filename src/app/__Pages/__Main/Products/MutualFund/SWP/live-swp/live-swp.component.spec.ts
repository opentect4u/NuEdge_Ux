import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveSwpComponent } from './live-swp.component';

describe('LiveSwpComponent', () => {
  let component: LiveSwpComponent;
  let fixture: ComponentFixture<LiveSwpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiveSwpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveSwpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
