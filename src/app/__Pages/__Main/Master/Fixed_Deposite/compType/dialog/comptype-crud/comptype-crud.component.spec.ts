import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComptypeCrudComponent } from './comptype-crud.component';

describe('ComptypeCrudComponent', () => {
  let component: ComptypeCrudComponent;
  let fixture: ComponentFixture<ComptypeCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComptypeCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComptypeCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
