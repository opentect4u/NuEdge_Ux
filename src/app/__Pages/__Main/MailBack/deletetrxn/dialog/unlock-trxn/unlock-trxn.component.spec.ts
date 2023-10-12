import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnlockTrxnComponent } from './unlock-trxn.component';

describe('UnlockTrxnComponent', () => {
  let component: UnlockTrxnComponent;
  let fixture: ComponentFixture<UnlockTrxnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnlockTrxnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnlockTrxnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
