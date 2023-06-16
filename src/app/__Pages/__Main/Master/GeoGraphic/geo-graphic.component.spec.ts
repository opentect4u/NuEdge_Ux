import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeoGraphicComponent } from './geo-graphic.component';

describe('GeoGraphicComponent', () => {
  let component: GeoGraphicComponent;
  let fixture: ComponentFixture<GeoGraphicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeoGraphicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeoGraphicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
