import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FDCertificateComponent } from './fdcertificate.component';

describe('FDCertificateComponent', () => {
  let component: FDCertificateComponent;
  let fixture: ComponentFixture<FDCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FDCertificateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FDCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
