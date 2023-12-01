import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyMisComponent } from './monthly-mis.component';

describe('MonthlyMisComponent', () => {
  let component: MonthlyMisComponent;
  let fixture: ComponentFixture<MonthlyMisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthlyMisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyMisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
