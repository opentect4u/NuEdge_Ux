import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileHelpComponent } from './file-help.component';

describe('FileHelpComponent', () => {
  let component: FileHelpComponent;
  let fixture: ComponentFixture<FileHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileHelpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
