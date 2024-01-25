import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveMfPortFolioComponent } from './live-mf-port-folio.component';

describe('LiveMfPortFolioComponent', () => {
  let component: LiveMfPortFolioComponent;
  let fixture: ComponentFixture<LiveMfPortFolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiveMfPortFolioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveMfPortFolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
