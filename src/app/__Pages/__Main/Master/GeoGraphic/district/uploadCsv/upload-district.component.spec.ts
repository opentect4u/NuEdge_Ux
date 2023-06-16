import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDistrictComponent } from './upload-district.component';

describe('UploadDistrictComponent', () => {
  let component: UploadDistrictComponent;
  let fixture: ComponentFixture<UploadDistrictComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadDistrictComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadDistrictComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
