import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberSrchComponent } from './member-srch.component';

describe('MemberSrchComponent', () => {
  let component: MemberSrchComponent;
  let fixture: ComponentFixture<MemberSrchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberSrchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberSrchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
