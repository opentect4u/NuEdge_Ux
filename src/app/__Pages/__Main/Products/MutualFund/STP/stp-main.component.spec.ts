import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StpMainComponent } from './stp-main.component';

describe('StpMainComponent', () => {
  let component: StpMainComponent;
  let fixture: ComponentFixture<StpMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StpMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StpMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
