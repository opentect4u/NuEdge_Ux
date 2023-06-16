import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KychomeComponent } from './kychome.component';

describe('KychomeComponent', () => {
  let component: KychomeComponent;
  let fixture: ComponentFixture<KychomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KychomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KychomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
