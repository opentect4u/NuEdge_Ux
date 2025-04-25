import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NseLayoutComponent } from './nse-layout.component';

describe('NseLayoutComponent', () => {
  let component: NseLayoutComponent;
  let fixture: ComponentFixture<NseLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NseLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NseLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
