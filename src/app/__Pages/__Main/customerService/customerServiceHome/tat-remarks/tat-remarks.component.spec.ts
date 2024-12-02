import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TatRemarksComponent } from './tat-remarks.component';

describe('TatRemarksComponent', () => {
  let component: TatRemarksComponent;
  let fixture: ComponentFixture<TatRemarksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TatRemarksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TatRemarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
