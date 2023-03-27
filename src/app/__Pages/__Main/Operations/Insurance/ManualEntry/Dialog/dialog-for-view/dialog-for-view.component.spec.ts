import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogForViewComponent } from './dialog-for-view.component';

describe('DialogForViewComponent', () => {
  let component: DialogForViewComponent;
  let fixture: ComponentFixture<DialogForViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogForViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogForViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
