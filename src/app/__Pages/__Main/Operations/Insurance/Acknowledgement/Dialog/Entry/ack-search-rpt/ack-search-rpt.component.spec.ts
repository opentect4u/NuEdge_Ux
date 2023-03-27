import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AckSearchRPTComponent } from './ack-search-rpt.component';

describe('AckSearchRPTComponent', () => {
  let component: AckSearchRPTComponent;
  let fixture: ComponentFixture<AckSearchRPTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AckSearchRPTComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AckSearchRPTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
