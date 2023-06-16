import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PertnershipDtlsComponent } from './pertnership-dtls.component';

describe('PertnershipDtlsComponent', () => {
  let component: PertnershipDtlsComponent;
  let fixture: ComponentFixture<PertnershipDtlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PertnershipDtlsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PertnershipDtlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
