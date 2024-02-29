import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonFamilyListComponent } from './non-family-list.component';

describe('NonFamilyListComponent', () => {
  let component: NonFamilyListComponent;
  let fixture: ComponentFixture<NonFamilyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonFamilyListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NonFamilyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
