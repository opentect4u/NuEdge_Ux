import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyQueryStatusComponent } from './modify-query-status.component';

describe('ModifyQueryStatusComponent', () => {
  let component: ModifyQueryStatusComponent;
  let fixture: ComponentFixture<ModifyQueryStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyQueryStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyQueryStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
