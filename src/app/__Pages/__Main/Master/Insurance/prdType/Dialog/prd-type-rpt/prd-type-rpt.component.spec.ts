import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrdTypeRPTComponent } from './prd-type-rpt.component';

describe('PrdTypeRPTComponent', () => {
  let component: PrdTypeRPTComponent;
  let fixture: ComponentFixture<PrdTypeRPTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrdTypeRPTComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrdTypeRPTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
