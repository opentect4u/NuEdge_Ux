import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelcapitalgainComponent } from './relcapitalgain.component';

describe('RelcapitalgainComponent', () => {
  let component: RelcapitalgainComponent;
  let fixture: ComponentFixture<RelcapitalgainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelcapitalgainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelcapitalgainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
