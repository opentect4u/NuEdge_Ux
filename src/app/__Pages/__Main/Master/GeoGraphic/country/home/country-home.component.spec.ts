import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryHomeComponent } from './country-home.component';

describe('CountryHomeComponent', () => {
  let component: CountryHomeComponent;
  let fixture: ComponentFixture<CountryHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountryHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
