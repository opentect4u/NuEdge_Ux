import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaturedStpComponent } from './matured-stp.component';

describe('MaturedStpComponent', () => {
  let component: MaturedStpComponent;
  let fixture: ComponentFixture<MaturedStpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaturedStpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaturedStpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
