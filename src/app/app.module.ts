import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
/*<======NgX spinner Module=========>*/
import { NgxSpinnerModule } from "ngx-spinner";
import { NetworkInterceptor } from './__Interceptors/network.interceptor';
import { SnkbarModule } from './__Core/snkbar/snkbar.module';
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
/*<====== End =========>*/
/**<== Mat Progress Bar Module ==>*/
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
// import { AuthGuard } from './__Gaurd/canActivate/auth.guard';
/**<=== End ==> */
// import localeFr from '@angular/common/locales/fr';
// registerLocaleData(localeFr);
import { registerLocaleData } from '@angular/common';

import localeIn from '@angular/common/locales/en-IN';
import { LayoutModule } from '@angular/cdk/layout';
registerLocaleData(localeIn);

@NgModule({
  declarations: [
    AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    SnkbarModule,
    MatProgressBarModule,
    MatDialogModule,
    LayoutModule
    ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: NetworkInterceptor, multi: true },
    // {provide:LocationStrategy, useClass:HashLocationStrategy},
    {provide:LocationStrategy, useClass:PathLocationStrategy},
    { provide: LOCALE_ID, useValue: 'en-IN'},

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
