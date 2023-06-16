import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AckEntryComponent } from './ack-entry.component';

describe('AckEntryComponent', () => {
  let component: AckEntryComponent;
  let fixture: ComponentFixture<AckEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AckEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AckEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
