import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadCmpComponent } from './upload-cmp.component';

describe('UploadCmpComponent', () => {
  let component: UploadCmpComponent;
  let fixture: ComponentFixture<UploadCmpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadCmpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadCmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
