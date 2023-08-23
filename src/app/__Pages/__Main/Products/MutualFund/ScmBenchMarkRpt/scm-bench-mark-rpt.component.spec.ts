import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScmBenchMarkRptComponent } from './scm-bench-mark-rpt.component';

describe('ScmBenchMarkRptComponent', () => {
  let component: ScmBenchMarkRptComponent;
  let fixture: ComponentFixture<ScmBenchMarkRptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScmBenchMarkRptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScmBenchMarkRptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
