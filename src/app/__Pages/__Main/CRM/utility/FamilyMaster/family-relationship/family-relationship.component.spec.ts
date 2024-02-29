import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyRelationshipComponent } from './family-relationship.component';

describe('FamilyRelationshipComponent', () => {
  let component: FamilyRelationshipComponent;
  let fixture: ComponentFixture<FamilyRelationshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FamilyRelationshipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyRelationshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
