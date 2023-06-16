import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinPlanComponent } from './fin-plan.component';

describe('FinPlanComponent', () => {
  let component: FinPlanComponent;
  let fixture: ComponentFixture<FinPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
