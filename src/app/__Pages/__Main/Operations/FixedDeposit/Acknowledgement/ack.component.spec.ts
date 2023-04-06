import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AckComponent } from './ack.component';

describe('AckComponent', () => {
  let component: AckComponent;
  let fixture: ComponentFixture<AckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
