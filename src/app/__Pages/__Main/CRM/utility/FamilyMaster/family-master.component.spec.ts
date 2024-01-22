import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyMasterComponent } from './family-master.component';

describe('FamilyMasterComponent', () => {
  let component: FamilyMasterComponent;
  let fixture: ComponentFixture<FamilyMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FamilyMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
