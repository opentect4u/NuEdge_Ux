import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatureSwpComponent } from './mature-swp.component';

describe('MatureSwpComponent', () => {
  let component: MatureSwpComponent;
  let fixture: ComponentFixture<MatureSwpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatureSwpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatureSwpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
