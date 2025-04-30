import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactOnlineComponent } from './transact-online.component';

describe('TransactOnlineComponent', () => {
  let component: TransactOnlineComponent;
  let fixture: ComponentFixture<TransactOnlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactOnlineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactOnlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
