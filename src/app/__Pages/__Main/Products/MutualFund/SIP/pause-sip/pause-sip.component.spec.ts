import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PauseSIPComponent } from './pause-sip.component';

describe('PauseSIPComponent', () => {
  let component: PauseSIPComponent;
  let fixture: ComponentFixture<PauseSIPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PauseSIPComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PauseSIPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
