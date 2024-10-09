import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryTypeComponent } from './query-type.component';

describe('QueryTypeComponent', () => {
  let component: QueryTypeComponent;
  let fixture: ComponentFixture<QueryTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueryTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
