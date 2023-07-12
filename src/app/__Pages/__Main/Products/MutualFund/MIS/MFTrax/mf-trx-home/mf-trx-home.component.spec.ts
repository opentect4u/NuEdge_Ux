import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MfTrxHomeComponent } from './mf-trx-home.component';

describe('MfTrxHomeComponent', () => {
  let component: MfTrxHomeComponent;
  let fixture: ComponentFixture<MfTrxHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MfTrxHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MfTrxHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
