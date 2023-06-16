import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessInsideRPTComponent } from './business-inside-rpt.component';

describe('BusinessInsideRPTComponent', () => {
  let component: BusinessInsideRPTComponent;
  let fixture: ComponentFixture<BusinessInsideRPTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessInsideRPTComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessInsideRPTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
