import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuedgeOnlineLayoutComponent } from './nuedge-online-layout.component';

describe('NuedgeOnlineLayoutComponent', () => {
  let component: NuedgeOnlineLayoutComponent;
  let fixture: ComponentFixture<NuedgeOnlineLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NuedgeOnlineLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NuedgeOnlineLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
