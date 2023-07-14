import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailbackhomeComponent } from './mailbackhome.component';

describe('MailbackhomeComponent', () => {
  let component: MailbackhomeComponent;
  let fixture: ComponentFixture<MailbackhomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailbackhomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MailbackhomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
