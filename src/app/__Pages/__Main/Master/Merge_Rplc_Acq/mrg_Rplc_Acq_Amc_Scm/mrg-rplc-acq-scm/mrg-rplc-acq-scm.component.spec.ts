import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MrgRplcAcqScmComponent } from './mrg-rplc-acq-scm.component';

describe('MrgRplcAcqScmComponent', () => {
  let component: MrgRplcAcqScmComponent;
  let fixture: ComponentFixture<MrgRplcAcqScmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MrgRplcAcqScmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MrgRplcAcqScmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
