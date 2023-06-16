import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryEntryComponent } from './country-entry.component';

describe('CountryEntryComponent', () => {
  let component: CountryEntryComponent;
  let fixture: ComponentFixture<CountryEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountryEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
