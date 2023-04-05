import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RptComponent } from './rpt.component';

describe('RptComponent', () => {
  let component: RptComponent;
  let fixture: ComponentFixture<RptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
