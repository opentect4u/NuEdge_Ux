import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectorDtlsComponent } from './director-dtls.component';

describe('DirectorDtlsComponent', () => {
  let component: DirectorDtlsComponent;
  let fixture: ComponentFixture<DirectorDtlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectorDtlsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectorDtlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
