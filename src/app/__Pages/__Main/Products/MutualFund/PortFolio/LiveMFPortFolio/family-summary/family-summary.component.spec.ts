import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilySummaryComponent } from './family-summary.component';

describe('FamilySummaryComponent', () => {
  let component: FamilySummaryComponent;
  let fixture: ComponentFixture<FamilySummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FamilySummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
