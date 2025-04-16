import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AumBranchComponent } from './aum-branch.component';

describe('AumBranchComponent', () => {
  let component: AumBranchComponent;
  let fixture: ComponentFixture<AumBranchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AumBranchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AumBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
