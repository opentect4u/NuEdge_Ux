import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductMappingReportComponent } from './product-mapping-report.component';

describe('ProductMappingReportComponent', () => {
  let component: ProductMappingReportComponent;
  let fixture: ComponentFixture<ProductMappingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductMappingReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductMappingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
