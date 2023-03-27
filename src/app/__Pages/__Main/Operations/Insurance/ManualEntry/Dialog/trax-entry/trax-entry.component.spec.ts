import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraxEntryComponent } from './trax-entry.component';

describe('TraxEntryComponent', () => {
  let component: TraxEntryComponent;
  let fixture: ComponentFixture<TraxEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TraxEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TraxEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
