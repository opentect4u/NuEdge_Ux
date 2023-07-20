import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrxnTypeComponent } from './trxn-type.component';

describe('TrxnTypeComponent', () => {
  let component: TrxnTypeComponent;
  let fixture: ComponentFixture<TrxnTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrxnTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrxnTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
