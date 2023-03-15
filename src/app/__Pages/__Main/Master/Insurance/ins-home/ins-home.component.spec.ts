import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsHomeComponent } from './ins-home.component';

describe('InsHomeComponent', () => {
  let component: InsHomeComponent;
  let fixture: ComponentFixture<InsHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
