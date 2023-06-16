import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationWithItemperPageComponent } from './pagination-with-itemper-page.component';

describe('PaginationWithItemperPageComponent', () => {
  let component: PaginationWithItemperPageComponent;
  let fixture: ComponentFixture<PaginationWithItemperPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaginationWithItemperPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationWithItemperPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
