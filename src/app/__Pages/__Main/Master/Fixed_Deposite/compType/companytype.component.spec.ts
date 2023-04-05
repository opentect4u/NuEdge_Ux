import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanytypeComponent } from './companytype.component';

describe('CompanytypeComponent', () => {
  let component: CompanytypeComponent;
  let fixture: ComponentFixture<CompanytypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanytypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanytypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
