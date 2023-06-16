import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateHomeComponent } from './state-home.component';

describe('StateHomeComponent', () => {
  let component: StateHomeComponent;
  let fixture: ComponentFixture<StateHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StateHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StateHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
