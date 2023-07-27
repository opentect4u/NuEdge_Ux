import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailbackMismatchComponent } from './mailback-mismatch.component';

describe('MailbackMismatchComponent', () => {
  let component: MailbackMismatchComponent;
  let fixture: ComponentFixture<MailbackMismatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailbackMismatchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MailbackMismatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
