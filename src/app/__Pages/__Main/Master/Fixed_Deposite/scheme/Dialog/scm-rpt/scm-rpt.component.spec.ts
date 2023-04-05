import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScmRptComponent } from './scm-rpt.component';

describe('ScmRptComponent', () => {
  let component: ScmRptComponent;
  let fixture: ComponentFixture<ScmRptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScmRptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScmRptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
