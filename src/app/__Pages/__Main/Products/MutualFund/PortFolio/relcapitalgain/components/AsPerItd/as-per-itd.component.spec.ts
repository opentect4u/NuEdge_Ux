import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsPerItdComponent } from './as-per-itd.component';

describe('AsPerItdComponent', () => {
  let component: AsPerItdComponent;
  let fixture: ComponentFixture<AsPerItdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsPerItdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsPerItdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
