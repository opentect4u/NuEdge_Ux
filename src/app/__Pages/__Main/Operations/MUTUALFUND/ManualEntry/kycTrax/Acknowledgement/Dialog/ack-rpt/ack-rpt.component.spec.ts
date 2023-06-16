import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AckRptComponent } from './ack-rpt.component';

describe('AckRptComponent', () => {
  let component: AckRptComponent;
  let fixture: ComponentFixture<AckRptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AckRptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AckRptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
