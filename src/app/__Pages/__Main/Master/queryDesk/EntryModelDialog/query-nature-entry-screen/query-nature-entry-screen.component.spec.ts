import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryNatureEntryScreenComponent } from './query-nature-entry-screen.component';

describe('QueryNatureEntryScreenComponent', () => {
  let component: QueryNatureEntryScreenComponent;
  let fixture: ComponentFixture<QueryNatureEntryScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueryNatureEntryScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryNatureEntryScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
