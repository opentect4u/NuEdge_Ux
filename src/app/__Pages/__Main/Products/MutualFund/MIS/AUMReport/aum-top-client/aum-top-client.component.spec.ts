import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AumTopClientComponent } from './aum-top-client.component';

describe('AumTopClientComponent', () => {
  let component: AumTopClientComponent;
  let fixture: ComponentFixture<AumTopClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AumTopClientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AumTopClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
