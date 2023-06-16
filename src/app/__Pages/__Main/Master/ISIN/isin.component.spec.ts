import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsinComponent } from './isin.component';

describe('IsinComponent', () => {
  let component: IsinComponent;
  let fixture: ComponentFixture<IsinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
