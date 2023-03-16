import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductRPTComponent } from './product-rpt.component';

describe('ProductRPTComponent', () => {
  let component: ProductRPTComponent;
  let fixture: ComponentFixture<ProductRPTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductRPTComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductRPTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
