import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualUpdateEntryForMFComponent } from './manual-update-entry-for-mf.component';

describe('ManualUpdateEntryForMFComponent', () => {
  let component: ManualUpdateEntryForMFComponent;
  let fixture: ComponentFixture<ManualUpdateEntryForMFComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManualUpdateEntryForMFComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualUpdateEntryForMFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
