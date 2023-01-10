import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Route } from '../__Model/route';

@Injectable({
  providedIn: 'root'
})
export class UtiliService {
  private __route = new BehaviorSubject<Route>(null);
  private __renderer: Renderer2;
  public readonly __route$ = this.__route.asObservable().pipe(delay(1));
  constructor(private __router: Router,
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
  //Get Route Details
  getRoute(__route) {
    this.__route.next(__route);
  }
  //Adding Dropdown Script
  addScript() {
    let __script = this.__renderer.createElement('script');
    __script.src = "./assets/menu_file/menu_jQuery.js";
    __script.id = "mainJquery";
    this.__renderer.appendChild(this.__docs.body, __script);
  }
  //Remove dropdown script
  destroyScript() {
    if (<HTMLElement>this.__docs.getElementById('mainJquery')) {
      this.__docs.getElementById('mainJquery').remove();
    }
  }

}
