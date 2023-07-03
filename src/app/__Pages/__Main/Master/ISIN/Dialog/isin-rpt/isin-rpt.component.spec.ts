import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsinRptComponent } from './isin-rpt.component';

describe('IsinRptComponent', () => {
  let component: IsinRptComponent;
  let fixture: ComponentFixture<IsinRptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsinRptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsinRptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
