import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MergeAmcComponent } from './merge-amc.component';

describe('MergeAmcComponent', () => {
  let component: MergeAmcComponent;
  let fixture: ComponentFixture<MergeAmcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MergeAmcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MergeAmcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
