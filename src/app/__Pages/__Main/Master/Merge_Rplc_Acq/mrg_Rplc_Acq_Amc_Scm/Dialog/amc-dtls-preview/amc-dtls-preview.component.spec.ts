import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmcDtlsPreviewComponent } from './amc-dtls-preview.component';

describe('AmcDtlsPreviewComponent', () => {
  let component: AmcDtlsPreviewComponent;
  let fixture: ComponentFixture<AmcDtlsPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmcDtlsPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmcDtlsPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
