import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlymisMenusComponent } from './monthlymis-menus.component';

describe('MonthlymisMenusComponent', () => {
  let component: MonthlymisMenusComponent;
  let fixture: ComponentFixture<MonthlymisMenusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthlymisMenusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlymisMenusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
