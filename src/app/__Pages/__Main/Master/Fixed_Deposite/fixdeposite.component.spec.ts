import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixdepositeComponent } from './fixdeposite.component';

describe('FixdepositeComponent', () => {
  let component: FixdepositeComponent;
  let fixture: ComponentFixture<FixdepositeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixdepositeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FixdepositeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
