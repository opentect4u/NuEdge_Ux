import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AumFamilyComponent } from './aum-family.component';

describe('AumFamilyComponent', () => {
  let component: AumFamilyComponent;
  let fixture: ComponentFixture<AumFamilyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AumFamilyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AumFamilyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
