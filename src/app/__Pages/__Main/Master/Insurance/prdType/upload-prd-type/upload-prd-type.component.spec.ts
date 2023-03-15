import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPrdTypeComponent } from './upload-prd-type.component';

describe('UploadPrdTypeComponent', () => {
  let component: UploadPrdTypeComponent;
  let fixture: ComponentFixture<UploadPrdTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadPrdTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadPrdTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
