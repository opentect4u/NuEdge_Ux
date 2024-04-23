import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcommingTrxnComponent } from './upcomming-trxn.component';

describe('UpcommingTrxnComponent', () => {
  let component: UpcommingTrxnComponent;
  let fixture: ComponentFixture<UpcommingTrxnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpcommingTrxnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpcommingTrxnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
