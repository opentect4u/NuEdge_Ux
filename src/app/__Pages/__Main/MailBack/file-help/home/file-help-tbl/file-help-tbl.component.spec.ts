import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileHelpTblComponent } from './file-help-tbl.component';

describe('FileHelpTblComponent', () => {
  let component: FileHelpTblComponent;
  let fixture: ComponentFixture<FileHelpTblComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileHelpTblComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileHelpTblComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
