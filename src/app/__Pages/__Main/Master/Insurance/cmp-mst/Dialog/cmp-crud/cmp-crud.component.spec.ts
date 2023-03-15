import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpCrudComponent } from './cmp-crud.component';

describe('CmpCrudComponent', () => {
  let component: CmpCrudComponent;
  let fixture: ComponentFixture<CmpCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmpCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
