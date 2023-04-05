import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdTraxComponent } from './fd-trax.component';

describe('FdTraxComponent', () => {
  let component: FdTraxComponent;
  let fixture: ComponentFixture<FdTraxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FdTraxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FdTraxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
