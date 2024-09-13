import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductEntrySecreenComponent } from './product-entry-secreen.component';

describe('ProductEntrySecreenComponent', () => {
  let component: ProductEntrySecreenComponent;
  let fixture: ComponentFixture<ProductEntrySecreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductEntrySecreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductEntrySecreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
