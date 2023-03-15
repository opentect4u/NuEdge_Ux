import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrdTypeComponent } from './prd-type.component';

describe('PrdTypeComponent', () => {
  let component: PrdTypeComponent;
  let fixture: ComponentFixture<PrdTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrdTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrdTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
