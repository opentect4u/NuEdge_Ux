import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminateStpComponent } from './terminate-stp.component';

describe('TerminateStpComponent', () => {
  let component: TerminateStpComponent;
  let fixture: ComponentFixture<TerminateStpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TerminateStpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminateStpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
