import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxPkgComponent } from './tax-pkg.component';

describe('TaxPkgComponent', () => {
  let component: TaxPkgComponent;
  let fixture: ComponentFixture<TaxPkgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxPkgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxPkgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
