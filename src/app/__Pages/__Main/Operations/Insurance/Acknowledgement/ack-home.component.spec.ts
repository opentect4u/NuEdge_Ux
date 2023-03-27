import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AckHomeComponent } from './ack-home.component';

describe('AckHomeComponent', () => {
  let component: AckHomeComponent;
  let fixture: ComponentFixture<AckHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AckHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AckHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
