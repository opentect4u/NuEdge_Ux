import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StpHomeComponent } from './stp-home.component';

describe('StpHomeComponent', () => {
  let component: StpHomeComponent;
  let fixture: ComponentFixture<StpHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StpHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StpHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
