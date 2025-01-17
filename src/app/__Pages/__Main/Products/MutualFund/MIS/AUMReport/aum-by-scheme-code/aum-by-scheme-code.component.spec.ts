import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AumBySchemeCodeComponent } from './aum-by-scheme-code.component';

describe('AumBySchemeCodeComponent', () => {
  let component: AumBySchemeCodeComponent;
  let fixture: ComponentFixture<AumBySchemeCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AumBySchemeCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AumBySchemeCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
