import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AckEntryRptComponent } from './ack-entry-rpt.component';

describe('AckEntryRptComponent', () => {
  let component: AckEntryRptComponent;
  let fixture: ComponentFixture<AckEntryRptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AckEntryRptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AckEntryRptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
