import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SrchComponent } from './srch.component';

describe('SrchComponent', () => {
  let component: SrchComponent;
  let fixture: ComponentFixture<SrchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SrchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SrchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
