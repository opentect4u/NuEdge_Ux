import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KycTraxComponent } from './kyc-trax.component';

describe('KycTraxComponent', () => {
  let component: KycTraxComponent;
  let fixture: ComponentFixture<KycTraxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KycTraxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KycTraxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
