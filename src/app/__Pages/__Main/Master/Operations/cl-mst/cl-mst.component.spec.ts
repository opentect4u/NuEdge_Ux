import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClMstComponent } from './cl-mst.component';

describe('ClMstComponent', () => {
  let component: ClMstComponent;
  let fixture: ComponentFixture<ClMstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClMstComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClMstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
