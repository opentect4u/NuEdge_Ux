import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewalmainComponent } from './renewalmain.component';

describe('RenewalmainComponent', () => {
  let component: RenewalmainComponent;
  let fixture: ComponentFixture<RenewalmainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenewalmainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RenewalmainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
