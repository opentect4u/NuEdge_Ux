import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NfoEntryComponent } from './nfo-entry.component';

describe('NfoEntryComponent', () => {
  let component: NfoEntryComponent;
  let fixture: ComponentFixture<NfoEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NfoEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NfoEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
