import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCustomerByEntryComponent } from './create-customer-by-entry.component';

describe('CreateCustomerByEntryComponent', () => {
  let component: CreateCustomerByEntryComponent;
  let fixture: ComponentFixture<CreateCustomerByEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCustomerByEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCustomerByEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
