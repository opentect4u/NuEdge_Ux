import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryEntryComponentComponent } from './query-entry-component.component';

describe('QueryEntryComponentComponent', () => {
  let component: QueryEntryComponentComponent;
  let fixture: ComponentFixture<QueryEntryComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueryEntryComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryEntryComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
