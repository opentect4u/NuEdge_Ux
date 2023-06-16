import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CityRPTComponent } from './city-rpt.component';

describe('CityRPTComponent', () => {
  let component: CityRPTComponent;
  let fixture: ComponentFixture<CityRPTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CityRPTComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CityRPTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
