import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectorDtlsEntryComponent } from './director-dtls-entry.component';

describe('DirectorDtlsEntryComponent', () => {
  let component: DirectorDtlsEntryComponent;
  let fixture: ComponentFixture<DirectorDtlsEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectorDtlsEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectorDtlsEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
