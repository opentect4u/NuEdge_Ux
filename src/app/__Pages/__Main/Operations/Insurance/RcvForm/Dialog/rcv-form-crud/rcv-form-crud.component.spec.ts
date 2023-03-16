import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RcvFormCrudComponent } from './rcv-form-crud.component';

describe('RcvFormCrudComponent', () => {
  let component: RcvFormCrudComponent;
  let fixture: ComponentFixture<RcvFormCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RcvFormCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RcvFormCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
