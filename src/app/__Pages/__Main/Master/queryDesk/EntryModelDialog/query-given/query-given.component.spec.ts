import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryGivenComponent } from './query-given.component';

describe('QueryGivenComponent', () => {
  let component: QueryGivenComponent;
  let fixture: ComponentFixture<QueryGivenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueryGivenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryGivenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
