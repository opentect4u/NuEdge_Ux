import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NFOFormReceiveComponent } from './nfoform-receive.component';

describe('NFOFormReceiveComponent', () => {
  let component: NFOFormReceiveComponent;
  let fixture: ComponentFixture<NFOFormReceiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NFOFormReceiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NFOFormReceiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
