import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwpTypeComponent } from './swp-type.component';

describe('SwpTypeComponent', () => {
  let component: SwpTypeComponent;
  let fixture: ComponentFixture<SwpTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwpTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwpTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
