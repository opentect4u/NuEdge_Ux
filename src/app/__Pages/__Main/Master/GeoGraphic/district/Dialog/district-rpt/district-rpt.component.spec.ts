import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictRPTComponent } from './district-rpt.component';

describe('DistrictRPTComponent', () => {
  let component: DistrictRPTComponent;
  let fixture: ComponentFixture<DistrictRPTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DistrictRPTComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DistrictRPTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
