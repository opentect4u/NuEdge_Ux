import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryRptComponent } from './entry-rpt.component';

describe('EntryRptComponent', () => {
  let component: EntryRptComponent;
  let fixture: ComponentFixture<EntryRptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntryRptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryRptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
