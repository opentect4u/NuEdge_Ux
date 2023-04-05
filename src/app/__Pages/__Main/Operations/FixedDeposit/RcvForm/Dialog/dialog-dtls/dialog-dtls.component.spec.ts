import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDtlsComponent } from './dialog-dtls.component';

describe('DialogDtlsComponent', () => {
  let component: DialogDtlsComponent;
  let fixture: ComponentFixture<DialogDtlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDtlsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDtlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
