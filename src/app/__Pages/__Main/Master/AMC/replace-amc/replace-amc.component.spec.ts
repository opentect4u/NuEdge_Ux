import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplaceAMCComponent } from './replace-amc.component';

describe('ReplaceAMCComponent', () => {
  let component: ReplaceAMCComponent;
  let fixture: ComponentFixture<ReplaceAMCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReplaceAMCComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplaceAMCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
