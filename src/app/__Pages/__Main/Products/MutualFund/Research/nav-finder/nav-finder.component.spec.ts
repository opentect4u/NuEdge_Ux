import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavFinderComponent } from './nav-finder.component';

describe('NavFinderComponent', () => {
  let component: NavFinderComponent;
  let fixture: ComponentFixture<NavFinderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavFinderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavFinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
