import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailbackComponent } from './mailback.component';

describe('MailbackComponent', () => {
  let component: MailbackComponent;
  let fixture: ComponentFixture<MailbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailbackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MailbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
