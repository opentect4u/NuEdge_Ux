import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScmDtlsPreviewComponent } from './scm-dtls-preview.component';

describe('ScmDtlsPreviewComponent', () => {
  let component: ScmDtlsPreviewComponent;
  let fixture: ComponentFixture<ScmDtlsPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScmDtlsPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScmDtlsPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
