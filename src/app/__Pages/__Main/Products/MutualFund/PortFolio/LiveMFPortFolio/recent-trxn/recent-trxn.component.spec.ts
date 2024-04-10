import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentTrxnComponent } from './recent-trxn.component';

describe('RecentTrxnComponent', () => {
  let component: RecentTrxnComponent;
  let fixture: ComponentFixture<RecentTrxnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentTrxnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentTrxnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
