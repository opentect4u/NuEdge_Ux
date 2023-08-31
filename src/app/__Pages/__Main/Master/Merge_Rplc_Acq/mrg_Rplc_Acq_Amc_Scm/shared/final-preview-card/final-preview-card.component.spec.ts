import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalPreviewCardComponent } from './final-preview-card.component';

describe('FinalPreviewCardComponent', () => {
  let component: FinalPreviewCardComponent;
  let fixture: ComponentFixture<FinalPreviewCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinalPreviewCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalPreviewCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
