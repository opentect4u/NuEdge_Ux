import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedTblComponent } from './shared-tbl.component';

describe('SharedTblComponent', () => {
  let component: SharedTblComponent;
  let fixture: ComponentFixture<SharedTblComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedTblComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedTblComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
