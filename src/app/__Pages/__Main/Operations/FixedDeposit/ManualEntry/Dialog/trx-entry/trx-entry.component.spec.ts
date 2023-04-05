import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrxEntryComponent } from './trx-entry.component';

describe('TrxEntryComponent', () => {
  let component: TrxEntryComponent;
  let fixture: ComponentFixture<TrxEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrxEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrxEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
