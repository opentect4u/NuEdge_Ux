import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsTraxRPTComponent } from './ins-trax-rpt.component';

describe('InsTraxRPTComponent', () => {
  let component: InsTraxRPTComponent;
  let fixture: ComponentFixture<InsTraxRPTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsTraxRPTComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsTraxRPTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
