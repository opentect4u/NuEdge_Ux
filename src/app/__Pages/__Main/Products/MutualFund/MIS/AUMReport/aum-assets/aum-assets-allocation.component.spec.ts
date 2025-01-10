import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AumAssetsAllocationComponent } from './aum-assets-allocation.component';

describe('AumAssetsAllocationComponent', () => {
  let component: AumAssetsAllocationComponent;
  let fixture: ComponentFixture<AumAssetsAllocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AumAssetsAllocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AumAssetsAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
