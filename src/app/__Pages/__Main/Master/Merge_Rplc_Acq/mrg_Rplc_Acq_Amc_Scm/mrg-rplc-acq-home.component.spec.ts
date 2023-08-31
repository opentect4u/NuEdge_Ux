import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MrgRplcAcqHomeComponent } from './mrg-rplc-acq-home.component';

describe('MrgRplcAcqHomeComponent', () => {
  let component: MrgRplcAcqHomeComponent;
  let fixture: ComponentFixture<MrgRplcAcqHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MrgRplcAcqHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MrgRplcAcqHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
