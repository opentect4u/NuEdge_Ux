import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AumFilterComponent } from './aum-filter.component';

describe('AumFilterComponent', () => {
  let component: AumFilterComponent;
  let fixture: ComponentFixture<AumFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AumFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AumFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
