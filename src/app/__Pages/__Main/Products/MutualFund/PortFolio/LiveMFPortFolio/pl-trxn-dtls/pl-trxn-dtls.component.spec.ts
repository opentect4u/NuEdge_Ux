import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlTrxnDtlsComponent } from './pl-trxn-dtls.component';

describe('PlTrxnDtlsComponent', () => {
  let component: PlTrxnDtlsComponent;
  let fixture: ComponentFixture<PlTrxnDtlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlTrxnDtlsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlTrxnDtlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
