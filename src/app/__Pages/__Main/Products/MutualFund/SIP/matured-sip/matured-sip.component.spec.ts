import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaturedSIPComponent } from './matured-sip.component';

describe('MaturedSIPComponent', () => {
  let component: MaturedSIPComponent;
  let fixture: ComponentFixture<MaturedSIPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaturedSIPComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaturedSIPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
