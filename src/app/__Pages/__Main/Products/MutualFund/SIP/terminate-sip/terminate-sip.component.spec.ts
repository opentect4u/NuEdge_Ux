import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminateSIPComponent } from './terminate-sip.component';

describe('TerminateSIPComponent', () => {
  let component: TerminateSIPComponent;
  let fixture: ComponentFixture<TerminateSIPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TerminateSIPComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminateSIPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
