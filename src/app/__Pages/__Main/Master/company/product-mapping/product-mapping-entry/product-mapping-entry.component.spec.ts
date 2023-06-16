import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductMappingEntryComponent } from './product-mapping-entry.component';

describe('ProductMappingEntryComponent', () => {
  let component: ProductMappingEntryComponent;
  let fixture: ComponentFixture<ProductMappingEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductMappingEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductMappingEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
