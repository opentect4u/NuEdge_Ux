import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwpHomeComponent } from './swp-home.component';

describe('SwpHomeComponent', () => {
  let component: SwpHomeComponent;
  let fixture: ComponentFixture<SwpHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwpHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwpHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
