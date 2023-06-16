import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareHolderRPTComponent } from './share-holder-rpt.component';

describe('ShareHolderRPTComponent', () => {
  let component: ShareHolderRPTComponent;
  let fixture: ComponentFixture<ShareHolderRPTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareHolderRPTComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareHolderRPTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
