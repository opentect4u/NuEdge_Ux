import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictEntryComponent } from './district-entry.component';

describe('DistrictEntryComponent', () => {
  let component: DistrictEntryComponent;
  let fixture: ComponentFixture<DistrictEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DistrictEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DistrictEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
