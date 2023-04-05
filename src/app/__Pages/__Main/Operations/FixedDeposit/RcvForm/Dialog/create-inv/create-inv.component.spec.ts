import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateInvComponent } from './create-inv.component';

describe('CreateInvComponent', () => {
  let component: CreateInvComponent;
  let fixture: ComponentFixture<CreateInvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateInvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateInvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
