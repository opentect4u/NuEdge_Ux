import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MstDtlsComponent } from './mst-dtls.component';

describe('MstDtlsComponent', () => {
  let component: MstDtlsComponent;
  let fixture: ComponentFixture<MstDtlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MstDtlsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MstDtlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
