import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwpMainComponent } from './swp-main.component';

describe('SwpMainComponent', () => {
  let component: SwpMainComponent;
  let fixture: ComponentFixture<SwpMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwpMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwpMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
