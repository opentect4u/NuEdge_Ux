import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualupdateSearchComponent } from './manualupdate-search.component';

describe('ManualupdateSearchComponent', () => {
  let component: ManualupdateSearchComponent;
  let fixture: ComponentFixture<ManualupdateSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManualupdateSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualupdateSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
