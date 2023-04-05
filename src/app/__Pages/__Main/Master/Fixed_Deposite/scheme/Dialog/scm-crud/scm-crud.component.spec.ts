import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScmCrudComponent } from './scm-crud.component';

describe('ScmCrudComponent', () => {
  let component: ScmCrudComponent;
  let fixture: ComponentFixture<ScmCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScmCrudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScmCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
