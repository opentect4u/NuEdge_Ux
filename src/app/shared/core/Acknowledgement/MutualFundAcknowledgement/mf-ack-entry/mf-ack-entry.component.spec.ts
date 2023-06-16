import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MfAckEntryComponent } from './mf-ack-entry.component';

describe('MfAckEntryComponent', () => {
  let component: MfAckEntryComponent;
  let fixture: ComponentFixture<MfAckEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MfAckEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MfAckEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
