import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpContextToken,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, takeUntil, tap } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { UtiliService } from '../__Services/utils.service';
import { MatDialog } from '@angular/material/dialog';
import { storage } from '../__Utility/storage';
import { AU_TK } from '../strings/localStorage_key';
export const BYPASS_LOG = new HttpContextToken(() => false);
export const IS_CACHE = new HttpContextToken(() => false);
@Injectable()
export class NetworkInterceptor implements HttpInterceptor {
  totalRequests = 0;
  requestsCompleted = 0;
  constructor(private __spinner: NgxSpinnerService,
    private __utility:UtiliService,
    private __dialog: MatDialog
    ) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<unknown>> {

      const auth =  request.clone({
        headers: new HttpHeaders({
          'Authorization': storage.getItemFromLocalStorage(AU_TK)
          ? `Bearer ${this.__utility.decrypt_dtls(storage.getItemFromLocalStorage(AU_TK))}` : ''
        })
      });

    if (auth.context.get(BYPASS_LOG) === true){
      return next.handle(auth);
    }
    this.__spinner.show();
    this.totalRequests++;
    return next.handle(auth).pipe(
      takeUntil(this.__utility.onCancelPendingRequests()),
      finalize(() => {
        this.requestsCompleted++;
        if (this.requestsCompleted === this.totalRequests) {
          this.__spinner.hide();
          this.totalRequests = 0;
          this.requestsCompleted = 0;
        }
      }),
      catchError((error) => {
        if (error instanceof HttpErrorResponse) {
          if (error.error instanceof ErrorEvent) {
          } else {
            switch (error.status) {
              case 401: // Unautorized

              case 403: // Forbidden
                // console.log(`${error.statusText}`, 'Access Error');
                this.__utility.showSnackbar("403!! You do't have permisssion to access",0);
                localStorage.clear();
                this.__dialog.closeAll();
                this.__utility.navigate('/',null);
                break;
              case 404: // Not found
                // console.log(`${error.statusText}`, 'Route Error');
                this.__utility.showSnackbar("404!! Url Not Found",0);
                break;
              case 500: // Server error
                this.__utility.showSnackbar("500!! Internal Server error",0);
                break;
                case 400: // bad request
                this.__utility.showSnackbar("400!! Bad Request",0);
                break;
            }
          }
        } else {
        }
        return throwError(() => new Error(error.statusText));
      }),
      tap((event: any) =>{
        // if(request.method != 'GET' && request.context.get(IS_CACHE)){
        //   storage.set__scmDtls(request.body?.data)
        // }
      })
    )
  }
}
