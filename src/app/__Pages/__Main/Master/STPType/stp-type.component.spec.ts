import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StpTypeComponent } from './stp-type.component';

describe('StpTypeComponent', () => {
  let component: StpTypeComponent;
  let fixture: ComponentFixture<StpTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StpTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StpTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
