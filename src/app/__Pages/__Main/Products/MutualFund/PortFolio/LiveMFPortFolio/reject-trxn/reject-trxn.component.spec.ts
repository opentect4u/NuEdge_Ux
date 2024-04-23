import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectTrxnComponent } from './reject-trxn.component';

describe('RejectTrxnComponent', () => {
  let component: RejectTrxnComponent;
  let fixture: ComponentFixture<RejectTrxnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectTrxnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectTrxnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
