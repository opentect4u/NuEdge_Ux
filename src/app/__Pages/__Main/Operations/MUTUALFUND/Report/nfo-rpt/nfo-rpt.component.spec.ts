import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NfoRPTComponent } from './nfo-rpt.component';

describe('NfoRPTComponent', () => {
  let component: NfoRPTComponent;
  let fixture: ComponentFixture<NfoRPTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NfoRPTComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NfoRPTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
