import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryDeskLayoutComponent } from './query-desk-layout.component';

describe('QueryDeskLayoutComponent', () => {
  let component: QueryDeskLayoutComponent;
  let fixture: ComponentFixture<QueryDeskLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueryDeskLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryDeskLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
