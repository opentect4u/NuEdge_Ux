import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryRecieveGivenThroughComponent } from './query-recieve-given-through.component';

describe('QueryRecieveGivenThroughComponent', () => {
  let component: QueryRecieveGivenThroughComponent;
  let fixture: ComponentFixture<QueryRecieveGivenThroughComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueryRecieveGivenThroughComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryRecieveGivenThroughComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
