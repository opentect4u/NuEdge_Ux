import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundHouseComponent } from './fund-house.component';

describe('FundHouseComponent', () => {
  let component: FundHouseComponent;
  let fixture: ComponentFixture<FundHouseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FundHouseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FundHouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
