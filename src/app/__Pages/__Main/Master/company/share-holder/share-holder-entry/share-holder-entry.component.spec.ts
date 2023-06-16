import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareHolderEntryComponent } from './share-holder-entry.component';

describe('ShareHolderEntryComponent', () => {
  let component: ShareHolderEntryComponent;
  let fixture: ComponentFixture<ShareHolderEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareHolderEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareHolderEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
