import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AumCityWiseComponent } from './aum-city-wise.component';

describe('AumCityWiseComponent', () => {
  let component: AumCityWiseComponent;
  let fixture: ComponentFixture<AumCityWiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AumCityWiseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AumCityWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
