import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsMainComponent } from './ins-main.component';

describe('InsMainComponent', () => {
  let component: InsMainComponent;
  let fixture: ComponentFixture<InsMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
