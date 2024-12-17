import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerServiceAttachmentDownloadComponent } from './customer-service-attachment-download.component';

describe('CustomerServiceAttachmentDownloadComponent', () => {
  let component: CustomerServiceAttachmentDownloadComponent;
  let fixture: ComponentFixture<CustomerServiceAttachmentDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerServiceAttachmentDownloadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerServiceAttachmentDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
