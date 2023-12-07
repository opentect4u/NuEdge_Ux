import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerChangeComponent } from './broker-change.component';

describe('BrokerChangeComponent', () => {
  let component: BrokerChangeComponent;
  let fixture: ComponentFixture<BrokerChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrokerChangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokerChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
