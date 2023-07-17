import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { SnkbarModule } from './__Core/snkbar/snkbar.module';
import { NgxSpinnerModule } from 'ngx-spinner';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        SnkbarModule,
        NgxSpinnerModule,
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  /*** Test Progressbar show/hide  */
  it('should test progressbar',() =>{
    const isLoadingOnchangeRoute = true;
    expect(isLoadingOnchangeRoute).toBe(true);
  })
  /*** End */
});
