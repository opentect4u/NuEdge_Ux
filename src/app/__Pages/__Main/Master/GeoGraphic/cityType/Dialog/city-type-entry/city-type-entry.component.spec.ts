import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CityTypeEntryComponent } from './city-type-entry.component';

describe('CityTypeEntryComponent', () => {
  let component: CityTypeEntryComponent;
  let fixture: ComponentFixture<CityTypeEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CityTypeEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CityTypeEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
