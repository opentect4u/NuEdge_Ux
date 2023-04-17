import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RPTComponent } from './rpt.component';

describe('RPTComponent', () => {
  let component: RPTComponent;
  let fixture: ComponentFixture<RPTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RPTComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RPTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
