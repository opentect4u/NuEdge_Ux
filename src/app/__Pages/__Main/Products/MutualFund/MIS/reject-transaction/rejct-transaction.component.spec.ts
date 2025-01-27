import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejctTransactionComponent } from './rejct-transaction.component';

describe('RejctTransactionComponent', () => {
  let component: RejctTransactionComponent;
  let fixture: ComponentFixture<RejctTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejctTransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RejctTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
