import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystematicMissedTrxnComponent } from './systematic-missed-trxn.component';

describe('SystematicMissedTrxnComponent', () => {
  let component: SystematicMissedTrxnComponent;
  let fixture: ComponentFixture<SystematicMissedTrxnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystematicMissedTrxnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SystematicMissedTrxnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
