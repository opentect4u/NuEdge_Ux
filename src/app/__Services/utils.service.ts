import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { SnkbarComponent } from '../__Core/snkbar/snkbar.component';
import { Route } from '../__Model/route';

@Injectable({
  providedIn: 'root'
})
export class UtiliService {
  private __isvisibleMenuIcon = new BehaviorSubject<any>(null);
  public readonly __isvisibleMenuIcon$ = this.__isvisibleMenuIcon.asObservable().pipe(delay(1));

  private __route = new BehaviorSubject<Route>(null);
  private __renderer: Renderer2;
  public readonly __route$ = this.__route.asObservable().pipe(delay(1));
  constructor(private __router: Router,
    private _snackBar: MatSnackBar,
    private _renderer: RendererFactory2,
    @Inject(DOCUMENT) private __docs: Document) {
    this.__renderer = _renderer.createRenderer(null, null);
  }

  navigate(__route_url, __params: any | null = null) {
    if (__params) {
      this.__router.navigate([__route_url, __params]);
    }
    else {
      this.__router.navigate([__route_url]);
    }
  }
  navigatewithqueryparams(url,_params){
    console.log(url);
    
    this.__router.navigate([url],_params)
   
  }
  //Get Route Details
  getRoute(__route) {
    this.__route.next(__route);
  }

  getmenuIconVisible(isVisible){
    this.__isvisibleMenuIcon.next(isVisible)
  }
  //Adding Dropdown Script
  addScript() {
    let __script = this.__renderer.createElement('script');
    __script.src = "./assets/js/appendselect2.js";
    __script.id = "mainJquery";
    this.__renderer.appendChild(this.__docs.body, __script);
  }
  //Remove dropdown script
  destroyScript() {
    if (<HTMLElement>this.__docs.getElementById('mainJquery')) {
      this.__docs.getElementById('mainJquery').remove();
    }
  }

  showSnackbar(__msg,_suc){
    this._snackBar.openFromComponent(SnkbarComponent,
      {
        duration:4000,
        data: {
          message: __msg,
          icon: _suc == 1 ? 'check_circle_outline' : 'error_outline',
          suc: _suc
        }
      })
  }

}
