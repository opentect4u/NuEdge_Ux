import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadISINComponent } from './upload-isin.component';

describe('UploadISINComponent', () => {
  let component: UploadISINComponent;
  let fixture: ComponentFixture<UploadISINComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadISINComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadISINComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
