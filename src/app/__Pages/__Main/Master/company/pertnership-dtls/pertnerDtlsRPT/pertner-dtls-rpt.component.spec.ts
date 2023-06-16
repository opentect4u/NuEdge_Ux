import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PertnerDtlsRPTComponent } from './pertner-dtls-rpt.component';

describe('PertnerDtlsRPTComponent', () => {
  let component: PertnerDtlsRPTComponent;
  let fixture: ComponentFixture<PertnerDtlsRPTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PertnerDtlsRPTComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PertnerDtlsRPTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
