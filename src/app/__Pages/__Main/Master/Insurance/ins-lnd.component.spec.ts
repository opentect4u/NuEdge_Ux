import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsLndComponent } from './ins-lnd.component';

describe('InsLndComponent', () => {
  let component: InsLndComponent;
  let fixture: ComponentFixture<InsLndComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsLndComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsLndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
