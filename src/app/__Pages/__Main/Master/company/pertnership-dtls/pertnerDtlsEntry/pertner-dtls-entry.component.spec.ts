import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PertnerDtlsEntryComponent } from './pertner-dtls-entry.component';

describe('PertnerDtlsEntryComponent', () => {
  let component: PertnerDtlsEntryComponent;
  let fixture: ComponentFixture<PertnerDtlsEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PertnerDtlsEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PertnerDtlsEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
