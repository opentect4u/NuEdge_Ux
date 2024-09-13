import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryTypeSubTypeComponent } from './query-type-sub-type.component';

describe('QueryTypeSubTypeComponent', () => {
  let component: QueryTypeSubTypeComponent;
  let fixture: ComponentFixture<QueryTypeSubTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueryTypeSubTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryTypeSubTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
