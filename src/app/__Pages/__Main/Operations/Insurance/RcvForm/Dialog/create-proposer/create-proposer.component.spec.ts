import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProposerComponent } from './create-proposer.component';

describe('CreateProposerComponent', () => {
  let component: CreateProposerComponent;
  let fixture: ComponentFixture<CreateProposerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateProposerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProposerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
