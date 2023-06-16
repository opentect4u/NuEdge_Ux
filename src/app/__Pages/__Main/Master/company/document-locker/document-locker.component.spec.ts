import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentLockerComponent } from './document-locker.component';

describe('DocumentLockerComponent', () => {
  let component: DocumentLockerComponent;
  let fixture: ComponentFixture<DocumentLockerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentLockerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentLockerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
