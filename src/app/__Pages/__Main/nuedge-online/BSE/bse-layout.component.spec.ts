import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BseLayoutComponent } from './bse-layout.component';

describe('BseLayoutComponent', () => {
  let component: BseLayoutComponent;
  let fixture: ComponentFixture<BseLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BseLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BseLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
