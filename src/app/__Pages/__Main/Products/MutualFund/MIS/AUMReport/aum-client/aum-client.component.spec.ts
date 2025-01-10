import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AumClientComponent } from './aum-client.component';

describe('AumClientComponent', () => {
  let component: AumClientComponent;
  let fixture: ComponentFixture<AumClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AumClientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AumClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
