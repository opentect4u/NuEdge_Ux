import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AumTableComponent } from './aum-table.component';

describe('AumTableComponent', () => {
  let component: AumTableComponent;
  let fixture: ComponentFixture<AumTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AumTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AumTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
