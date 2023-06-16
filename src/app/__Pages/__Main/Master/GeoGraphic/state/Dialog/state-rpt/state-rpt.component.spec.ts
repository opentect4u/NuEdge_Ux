import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateRPTComponent } from './state-rpt.component';

describe('StateRPTComponent', () => {
  let component: StateRPTComponent;
  let fixture: ComponentFixture<StateRPTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StateRPTComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StateRPTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
