import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PincodeComponent } from './pincode.component';
import { SharedModule } from 'src/app/shared/shared.module';

describe('PincodeComponent', () => {
  let component: PincodeComponent;
  let fixture: ComponentFixture<PincodeComponent>;
  TestBed.configureTestingModule({
    imports:[SharedModule]
  })
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PincodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PincodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
