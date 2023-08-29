import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MergeRplcAcqComponent } from './merge-rplc-acq.component';

describe('MergeRplcAcqComponent', () => {
  let component: MergeRplcAcqComponent;
  let fixture: ComponentFixture<MergeRplcAcqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MergeRplcAcqComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MergeRplcAcqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
