import { ComponentFixture, TestBed } from '@angular/core/testing';
// import 'jasmine';
import { TrxnRptComponent } from './trxn-rpt.component';

describe('TrxnRptComponent', () => {
  let component: TrxnRptComponent;
  let fixture: ComponentFixture<TrxnRptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrxnRptComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrxnRptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
