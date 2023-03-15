import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpMstComponent } from './cmp-mst.component';

describe('CmpMstComponent', () => {
  let component: CmpMstComponent;
  let fixture: ComponentFixture<CmpMstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmpMstComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpMstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
