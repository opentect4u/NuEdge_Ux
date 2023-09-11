import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadBenchmarkComponent } from './upload-benchmark.component';

describe('UploadBenchmarkComponent', () => {
  let component: UploadBenchmarkComponent;
  let fixture: ComponentFixture<UploadBenchmarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadBenchmarkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadBenchmarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
