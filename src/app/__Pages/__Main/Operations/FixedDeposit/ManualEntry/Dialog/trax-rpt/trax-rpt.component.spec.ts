import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraxRPTComponent } from './trax-rpt.component';

describe('TraxRPTComponent', () => {
  let component: TraxRPTComponent;
  let fixture: ComponentFixture<TraxRPTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TraxRPTComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TraxRPTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
