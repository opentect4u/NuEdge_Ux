import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixdepositHomeComponent } from './fixdeposit-home.component';

describe('FixdepositHomeComponent', () => {
  let component: FixdepositHomeComponent;
  let fixture: ComponentFixture<FixdepositHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixdepositHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FixdepositHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
