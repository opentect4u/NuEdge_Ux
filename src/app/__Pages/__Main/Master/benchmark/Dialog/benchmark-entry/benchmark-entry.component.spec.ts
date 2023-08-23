import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BenchmarkEntryComponent } from './benchmark-entry.component';

describe('BenchmarkEntryComponent', () => {
  let component: BenchmarkEntryComponent;
  let fixture: ComponentFixture<BenchmarkEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BenchmarkEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BenchmarkEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
