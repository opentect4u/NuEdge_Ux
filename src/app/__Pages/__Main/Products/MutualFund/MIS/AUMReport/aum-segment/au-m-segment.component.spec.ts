import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuMSegmentComponent } from './au-m-segment.component';

describe('AuMSegmentComponent', () => {
  let component: AuMSegmentComponent;
  let fixture: ComponentFixture<AuMSegmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuMSegmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuMSegmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
