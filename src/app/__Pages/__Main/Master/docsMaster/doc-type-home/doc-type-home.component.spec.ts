import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocTypeHomeComponent } from './doc-type-home.component';

describe('DocTypeHomeComponent', () => {
  let component: DocTypeHomeComponent;
  let fixture: ComponentFixture<DocTypeHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocTypeHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocTypeHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
