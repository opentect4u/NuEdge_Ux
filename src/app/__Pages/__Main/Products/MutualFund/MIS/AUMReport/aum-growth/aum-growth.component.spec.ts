import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AumGrowthComponent } from './aum-growth.component';

describe('AumGrowthComponent', () => {
  let component: AumGrowthComponent;
  let fixture: ComponentFixture<AumGrowthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AumGrowthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AumGrowthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
