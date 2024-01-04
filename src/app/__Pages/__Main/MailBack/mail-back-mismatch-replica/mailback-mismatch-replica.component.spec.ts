import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailbackMismatchReplicalComponent } from './mailback-mismatch-replica.component';

describe('MailbackMismatchReplicalComponent', () => {
  let component: MailbackMismatchReplicalComponent;
  let fixture: ComponentFixture<MailbackMismatchReplicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailbackMismatchReplicalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MailbackMismatchReplicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
