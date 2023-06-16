import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeographicRPTComponent } from './geographic-rpt.component';

describe('GeographicRPTComponent', () => {
  let component: GeographicRPTComponent;
  let fixture: ComponentFixture<GeographicRPTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeographicRPTComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeographicRPTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
