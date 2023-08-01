import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PauseSwpComponent } from './pause-swp.component';

describe('PauseSwpComponent', () => {
  let component: PauseSwpComponent;
  let fixture: ComponentFixture<PauseSwpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PauseSwpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PauseSwpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
