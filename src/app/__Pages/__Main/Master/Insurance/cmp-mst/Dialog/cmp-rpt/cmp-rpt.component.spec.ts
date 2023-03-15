import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpRPTComponent } from './cmp-rpt.component';

describe('CmpRPTComponent', () => {
  let component: CmpRPTComponent;
  let fixture: ComponentFixture<CmpRPTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmpRPTComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpRPTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
