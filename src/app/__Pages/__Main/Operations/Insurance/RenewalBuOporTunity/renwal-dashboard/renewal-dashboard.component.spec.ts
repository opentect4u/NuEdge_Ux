import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewalDashboardComponent } from './renewal-dashboard.component';

describe('RenewalDashboardComponent', () => {
  let component: RenewalDashboardComponent;
  let fixture: ComponentFixture<RenewalDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenewalDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RenewalDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
