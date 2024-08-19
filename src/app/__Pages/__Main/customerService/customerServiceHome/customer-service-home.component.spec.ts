import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerServiceHomeComponent } from './customer-service-home.component';

describe('CustomerServiceHomeComponent', () => {
  let component: CustomerServiceHomeComponent;
  let fixture: ComponentFixture<CustomerServiceHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerServiceHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerServiceHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
