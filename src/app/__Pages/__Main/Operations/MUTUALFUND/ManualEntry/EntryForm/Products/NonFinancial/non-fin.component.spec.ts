import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonFinComponent } from './non-fin.component';

describe('NonFinComponent', () => {
  let component: NonFinComponent;
  let fixture: ComponentFixture<NonFinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonFinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NonFinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
