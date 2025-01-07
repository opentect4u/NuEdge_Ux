import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NfoManualUpdateComponent } from './nfo-manual-update.component';

describe('NfoManualUpdateComponent', () => {
  let component: NfoManualUpdateComponent;
  let fixture: ComponentFixture<NfoManualUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NfoManualUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NfoManualUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
