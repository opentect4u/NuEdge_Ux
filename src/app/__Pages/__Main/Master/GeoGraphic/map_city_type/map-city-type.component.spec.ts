import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapCityTypeComponent } from './map-city-type.component';

describe('MapCityTypeComponent', () => {
  let component: MapCityTypeComponent;
  let fixture: ComponentFixture<MapCityTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapCityTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapCityTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
