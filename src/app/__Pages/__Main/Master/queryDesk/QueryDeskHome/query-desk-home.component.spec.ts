import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryDeskHomeComponent } from './query-desk-home.component';

describe('QueryDeskHomeComponent', () => {
  let component: QueryDeskHomeComponent;
  let fixture: ComponentFixture<QueryDeskHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueryDeskHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryDeskHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
