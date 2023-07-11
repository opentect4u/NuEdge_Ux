import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientCmnRptComponent } from './client-cmn-rpt.component';

describe('ClientCmnRptComponent', () => {
  let component: ClientCmnRptComponent;
  let fixture: ComponentFixture<ClientCmnRptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientCmnRptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientCmnRptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
