import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MftraxModificationComponent } from './mftrax-modification.component';

describe('MftraxModificationComponent', () => {
  let component: MftraxModificationComponent;
  let fixture: ComponentFixture<MftraxModificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MftraxModificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MftraxModificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
