import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryDtlsComponent } from './query-dtls.component';

describe('QueryDtlsComponent', () => {
  let component: QueryDtlsComponent;
  let fixture: ComponentFixture<QueryDtlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueryDtlsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryDtlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
