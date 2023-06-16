import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentLockerDtlsRPTComponent } from './document-locker-dtls-rpt.component';

describe('DocumentLockerDtlsRPTComponent', () => {
  let component: DocumentLockerDtlsRPTComponent;
  let fixture: ComponentFixture<DocumentLockerDtlsRPTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentLockerDtlsRPTComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentLockerDtlsRPTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
