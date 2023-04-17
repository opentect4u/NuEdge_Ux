import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchRPTComponent } from './search-rpt.component';

describe('SearchRPTComponent', () => {
  let component: SearchRPTComponent;
  let fixture: ComponentFixture<SearchRPTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchRPTComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchRPTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
