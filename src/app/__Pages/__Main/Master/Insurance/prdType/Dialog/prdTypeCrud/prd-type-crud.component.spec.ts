import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrdTypeCrudComponent } from './prd-type-crud.component';

describe('PrdTypeCrudComponent', () => {
  let component: PrdTypeCrudComponent;
  let fixture: ComponentFixture<PrdTypeCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrdTypeCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrdTypeCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
