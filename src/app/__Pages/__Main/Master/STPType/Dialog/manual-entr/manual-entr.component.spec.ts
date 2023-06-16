import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualEntrComponent } from './manual-entr.component';

describe('ManualEntrComponent', () => {
  let component: ManualEntrComponent;
  let fixture: ComponentFixture<ManualEntrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManualEntrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualEntrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
