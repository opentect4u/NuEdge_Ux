import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AckEntryComponent } from './ack-entry.component';
import { SharedModule } from 'src/app/shared/shared.module';

describe('AckEntryComponent', () => {
  let component: AckEntryComponent;
  let fixture: ComponentFixture<AckEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AckEntryComponent ],
      imports:[SharedModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AckEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
