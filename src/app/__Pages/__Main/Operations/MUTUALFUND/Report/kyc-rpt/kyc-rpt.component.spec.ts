import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KycRptComponent } from './kyc-rpt.component';

describe('KycRptComponent', () => {
  let component: KycRptComponent;
  let fixture: ComponentFixture<KycRptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KycRptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KycRptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
