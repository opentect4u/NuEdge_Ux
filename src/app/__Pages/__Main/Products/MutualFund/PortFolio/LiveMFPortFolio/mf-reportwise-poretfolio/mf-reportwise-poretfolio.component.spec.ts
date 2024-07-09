import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MfReportwisePoretfolioComponent } from './mf-reportwise-poretfolio.component';

describe('MfReportwisePoretfolioComponent', () => {
  let component: MfReportwisePoretfolioComponent;
  let fixture: ComponentFixture<MfReportwisePoretfolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MfReportwisePoretfolioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MfReportwisePoretfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
