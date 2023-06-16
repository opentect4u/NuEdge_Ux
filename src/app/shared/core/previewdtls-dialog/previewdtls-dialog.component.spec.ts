import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewdtlsDialogComponent } from './previewdtls-dialog.component';

describe('PreviewdtlsDialogComponent', () => {
  let component: PreviewdtlsDialogComponent;
  let fixture: ComponentFixture<PreviewdtlsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewdtlsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewdtlsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
