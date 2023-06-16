import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductMappingComponent } from './product-mapping.component';

describe('ProductMappingComponent', () => {
  let component: ProductMappingComponent;
  let fixture: ComponentFixture<ProductMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
