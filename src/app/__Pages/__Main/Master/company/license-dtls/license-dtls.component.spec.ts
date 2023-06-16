import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseDtlsComponent } from './license-dtls.component';

describe('LicenseDtlsComponent', () => {
  let component: LicenseDtlsComponent;
  let fixture: ComponentFixture<LicenseDtlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LicenseDtlsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenseDtlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
