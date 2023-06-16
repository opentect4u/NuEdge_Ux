import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreDropdownComponent } from './core-dropdown.component';

describe('CoreDropdownComponent', () => {
  let component: CoreDropdownComponent;
  let fixture: ComponentFixture<CoreDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoreDropdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoreDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
