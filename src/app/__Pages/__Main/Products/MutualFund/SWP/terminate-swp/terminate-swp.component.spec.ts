import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminateSwpComponent } from './terminate-swp.component';

describe('TerminateSwpComponent', () => {
  let component: TerminateSwpComponent;
  let fixture: ComponentFixture<TerminateSwpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TerminateSwpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminateSwpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
