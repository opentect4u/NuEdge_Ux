import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPlanOptionComponent } from './map-plan-option.component';

describe('MapPlanOptionComponent', () => {
  let component: MapPlanOptionComponent;
  let fixture: ComponentFixture<MapPlanOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapPlanOptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapPlanOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
