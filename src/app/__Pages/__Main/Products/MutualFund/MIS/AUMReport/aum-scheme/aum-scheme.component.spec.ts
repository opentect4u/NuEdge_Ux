import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AumSchemeComponent } from './aum-scheme.component';

describe('AumSchemeComponent', () => {
  let component: AumSchemeComponent;
  let fixture: ComponentFixture<AumSchemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AumSchemeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AumSchemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
