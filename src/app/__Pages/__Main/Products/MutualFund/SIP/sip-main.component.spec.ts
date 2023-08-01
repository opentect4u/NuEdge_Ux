import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SipMainComponent } from './sip-main.component';

describe('SipMainComponent', () => {
  let component: SipMainComponent;
  let fixture: ComponentFixture<SipMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SipMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SipMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
