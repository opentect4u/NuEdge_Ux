import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerqueComponent } from './merque.component';

describe('MerqueComponent', () => {
  let component: MerqueComponent;
  let fixture: ComponentFixture<MerqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerqueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
