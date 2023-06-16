import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AumComponent } from './aum.component';

describe('AumComponent', () => {
  let component: AumComponent;
  let fixture: ComponentFixture<AumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AumComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
