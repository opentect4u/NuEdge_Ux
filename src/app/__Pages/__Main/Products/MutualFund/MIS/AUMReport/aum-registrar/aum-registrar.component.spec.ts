import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AumRegistrarComponent } from './aum-registrar.component';

describe('AumRegistrarComponent', () => {
  let component: AumRegistrarComponent;
  let fixture: ComponentFixture<AumRegistrarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AumRegistrarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AumRegistrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
