import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AckRPTComponent } from './ack-rpt.component';

describe('AckRPTComponent', () => {
  let component: AckRPTComponent;
  let fixture: ComponentFixture<AckRPTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AckRPTComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AckRPTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
