import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadHelpComponent } from './upload-help.component';

describe('UploadHelpComponent', () => {
  let component: UploadHelpComponent;
  let fixture: ComponentFixture<UploadHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadHelpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
