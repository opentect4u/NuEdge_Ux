import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CityTypeRptComponent } from './city-type-rpt.component';

describe('CityTypeRptComponent', () => {
  let component: CityTypeRptComponent;
  let fixture: ComponentFixture<CityTypeRptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CityTypeRptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CityTypeRptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
