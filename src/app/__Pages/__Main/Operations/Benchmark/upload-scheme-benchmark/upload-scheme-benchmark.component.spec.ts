import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadSchemeBenchmarkComponent } from './upload-scheme-benchmark.component';

describe('UploadSchemeBenchmarkComponent', () => {
  let component: UploadSchemeBenchmarkComponent;
  let fixture: ComponentFixture<UploadSchemeBenchmarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadSchemeBenchmarkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadSchemeBenchmarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
