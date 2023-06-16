import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryRPTComponent } from './country-rpt.component';

describe('CountryRPTComponent', () => {
  let component: CountryRPTComponent;
  let fixture: ComponentFixture<CountryRPTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountryRPTComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryRPTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
