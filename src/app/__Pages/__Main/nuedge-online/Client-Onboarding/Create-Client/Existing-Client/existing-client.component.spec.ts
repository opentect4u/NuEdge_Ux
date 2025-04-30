import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingClientComponent } from './existing-client.component';

describe('ExistingClientComponent', () => {
  let component: ExistingClientComponent;
  let fixture: ComponentFixture<ExistingClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExistingClientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExistingClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
