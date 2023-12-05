import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisTblComponent } from './mis-tbl.component';

describe('MisTblComponent', () => {
  let component: MisTblComponent;
  let fixture: ComponentFixture<MisTblComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MisTblComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MisTblComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
