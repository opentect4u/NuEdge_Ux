import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RptFilterComponent } from './rpt-filter.component';

describe('RptFilterComponent', () => {
  let component: RptFilterComponent;
  let fixture: ComponentFixture<RptFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RptFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RptFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
