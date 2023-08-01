import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SipHomeComponent } from './sip-home.component';

describe('SipHomeComponent', () => {
  let component: SipHomeComponent;
  let fixture: ComponentFixture<SipHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SipHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SipHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
