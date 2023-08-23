import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletetrxnComponent } from './deletetrxn.component';

describe('DeletetrxnComponent', () => {
  let component: DeletetrxnComponent;
  let fixture: ComponentFixture<DeletetrxnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletetrxnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletetrxnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
