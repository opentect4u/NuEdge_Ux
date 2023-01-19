import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
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

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    SnkbarModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: NetworkInterceptor, multi: true },
    {provide:LocationStrategy, useClass:HashLocationStrategy},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
