import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AMCEntryComponent } from './amcentry.component';

describe('AMCEntryComponent', () => {
  let component: AMCEntryComponent;
  let fixture: ComponentFixture<AMCEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AMCEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AMCEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
