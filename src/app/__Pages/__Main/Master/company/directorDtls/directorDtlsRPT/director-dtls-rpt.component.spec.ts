import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectorDtlsRptComponent } from './director-dtls-rpt.component';

describe('DirectorDtlsRptComponent', () => {
  let component: DirectorDtlsRptComponent;
  let fixture: ComponentFixture<DirectorDtlsRptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectorDtlsRptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectorDtlsRptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
