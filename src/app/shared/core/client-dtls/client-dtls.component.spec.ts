import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientDtlsComponent } from './client-dtls.component';

describe('ClientDtlsComponent', () => {
  let component: ClientDtlsComponent;
  let fixture: ComponentFixture<ClientDtlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientDtlsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientDtlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
