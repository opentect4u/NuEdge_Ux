import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumebntLockerDtlsEntryComponent } from './documebnt-locker-dtls-entry.component';

describe('DocumebntLockerDtlsEntryComponent', () => {
  let component: DocumebntLockerDtlsEntryComponent;
  let fixture: ComponentFixture<DocumebntLockerDtlsEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumebntLockerDtlsEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumebntLockerDtlsEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
