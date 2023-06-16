import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NfoComponent } from './nfo.component';

describe('NfoComponent', () => {
  let component: NfoComponent;
  let fixture: ComponentFixture<NfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
