import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PauseStpComponent } from './pause-stp.component';

describe('PauseStpComponent', () => {
  let component: PauseStpComponent;
  let fixture: ComponentFixture<PauseStpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PauseStpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PauseStpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
