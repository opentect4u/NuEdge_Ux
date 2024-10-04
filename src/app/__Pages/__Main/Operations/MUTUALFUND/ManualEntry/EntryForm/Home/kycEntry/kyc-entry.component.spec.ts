import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KycEntryComponent } from './kyc-entry.component';

describe('KycEntryComponent', () => {
  let component: KycEntryComponent;
  let fixture: ComponentFixture<KycEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KycEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KycEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
