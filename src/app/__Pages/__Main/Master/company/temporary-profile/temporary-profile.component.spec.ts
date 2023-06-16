import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemporaryProfileComponent } from './temporary-profile.component';

describe('TemporaryProfileComponent', () => {
  let component: TemporaryProfileComponent;
  let fixture: ComponentFixture<TemporaryProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemporaryProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemporaryProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
