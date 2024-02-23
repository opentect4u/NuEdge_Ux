import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MFTraxComponent } from './mftrax.component';

describe('MFTraxComponent', () => {
  let component: MFTraxComponent;
  let fixture: ComponentFixture<MFTraxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MFTraxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MFTraxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
