import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnWithMenuComponent } from './btn-with-menu.component';

describe('BtnWithMenuComponent', () => {
  let component: BtnWithMenuComponent;
  let fixture: ComponentFixture<BtnWithMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BtnWithMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnWithMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
