import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MegaMenuForColumnComponent } from './mega-menu-for-column.component';

describe('MegaMenuForColumnComponent', () => {
  let component: MegaMenuForColumnComponent;
  let fixture: ComponentFixture<MegaMenuForColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MegaMenuForColumnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MegaMenuForColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
