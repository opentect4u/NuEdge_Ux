import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateEntryComponent } from './state-entry.component';

describe('StateEntryComponent', () => {
  let component: StateEntryComponent;
  let fixture: ComponentFixture<StateEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StateEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StateEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
