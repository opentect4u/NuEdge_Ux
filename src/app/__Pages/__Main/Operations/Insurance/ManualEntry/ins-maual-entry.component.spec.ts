import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsMaualEntryComponent } from './ins-maual-entry.component';

describe('InsMaualEntryComponent', () => {
  let component: InsMaualEntryComponent;
  let fixture: ComponentFixture<InsMaualEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsMaualEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsMaualEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
