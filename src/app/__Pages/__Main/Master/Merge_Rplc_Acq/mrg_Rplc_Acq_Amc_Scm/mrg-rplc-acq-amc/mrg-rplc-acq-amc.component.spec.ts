import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MrgRplcAcqAmcComponent } from './mrg-rplc-acq-amc.component';

describe('MrgRplcAcqAmcComponent', () => {
  let component: MrgRplcAcqAmcComponent;
  let fixture: ComponentFixture<MrgRplcAcqAmcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MrgRplcAcqAmcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MrgRplcAcqAmcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
