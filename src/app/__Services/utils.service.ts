import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { MatSnackBar} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
// import { IBreadCrumb } from '../app.component';
import { SnkbarComponent } from '../__Core/snkbar/snkbar.component';
import { breadCrumb } from '../__Model/brdCrmb';
import { Route } from '../__Model/route';
import { global } from '../__Utility/globalFunc';
import * as CryptoJs from '../../assets/js/EnDcrypt.js';
import { AES_IV, EN_DE, ERRR, HASH_EN_DE } from '../strings/localStorage_key';
@Injectable({
  providedIn: 'root',
})
export class UtiliService {

  private cancelPendingRequests$ = new Subject<void>()

  private __brdCrumbs = new BehaviorSubject<breadCrumb[]>([]);
  public readonly __brdCrumbs$ = this.__brdCrumbs.asObservable().pipe(delay(1));

  private __latestBrdCrmbs = new BehaviorSubject<breadCrumb[]>([]);
  public readonly __latestBrdCrmbs$ = this.__latestBrdCrmbs.asObservable().pipe(delay(1));

  private __isvisibleMenuIcon = new BehaviorSubject<any>(null);
  public readonly __isvisibleMenuIcon$ = this.__isvisibleMenuIcon.asObservable().pipe(delay(1));

  private breakPointObserver = new BehaviorSubject<any>(null);
  public readonly __breakPointObserver$ = this.breakPointObserver.asObservable().pipe(delay(1));

  private __route = new BehaviorSubject<Route>(null);
  private __renderer: Renderer2;
  public readonly __route$ = this.__route.asObservable().pipe(delay(1));

  constructor(
    private __router: Router,
    private _snackBar: MatSnackBar,
    private _renderer: RendererFactory2,
    @Inject(DOCUMENT) private __docs: Document
  ) {
    this.__renderer = _renderer.createRenderer(null, null);
  }

  navigate(__route_url, __params: any | null = null) {
    if (__params) {
      this.__router.navigate([__route_url, __params]);
    } else {
      this.__router.navigate([__route_url]);
    }
  }
  navigatewithqueryparams(url, _params) {
    this.__router.navigate([url], _params);
  }
  //Get Route Details
  getRoute(__route) {
    this.__route.next(__route);
  }

  getmenuIconVisible(isVisible) {
    this.__isvisibleMenuIcon.next(isVisible);
  }

  getBreadCrumb(__brcrmbs) {
    this.__brdCrumbs.next(__brcrmbs);
  }

  getLatestBrdCrmbs(__brdCrmbs){
    this.__latestBrdCrmbs.next(__brdCrmbs);
  }

   getBreakpoinStatus = (breakpoints) =>{
    this.breakPointObserver.next(breakpoints);
   }

  //Adding Dropdown Script
  addScript() {
    let __script = this.__renderer.createElement('script');
    __script.src = './assets/js/appendselect2.js';
    __script.id = 'mainJquery';
    this.__renderer.appendChild(this.__docs.body, __script);
  }
  //Remove dropdown script
  destroyScript() {
    if (<HTMLElement>this.__docs.getElementById('mainJquery')) {
      this.__docs.getElementById('mainJquery').remove();
    }
  }

  showSnackbar(__msg, _suc,iswarning:boolean | undefined = false) {
    this._snackBar.openFromComponent(SnkbarComponent, {
      duration: 4000,
      data: {
        message: __msg,
        icon: !iswarning ? (_suc == 1 ? 'check_circle_outline' : 'error_outline') : 'warning',
        suc: _suc,
        is_warning:iswarning
      },
    });
  }
  closeSnackBar(){
    this._snackBar.dismiss();
  }

  public settingsfroMultiselectDropdown(__id, __text,
     __placeholder,limit:number | undefined  = 2,
     max_hieght:number | undefined = 197,
     is_single_selection:boolean | undefined = false,
     is_disabled:boolean | undefined = false
     ) {
    let settings = {
      singleSelection: is_single_selection,
      idField: __id,
      textField: __text,
      enableCheckAll: true,
      selectAllText: 'Select All',
      unSelectAllText: 'Deselect All',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: max_hieght,
      itemsShowLimit: limit,
      searchPlaceholderText: __placeholder,
      noDataAvailablePlaceholderText: 'No records found',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
      lazyLoading: true,
      tagToBody: true,
      disabled:is_disabled
    };
    return settings;
  }

  checkIfclientExist(cl_code: string, __clMst): Observable<boolean> {
    return of(__clMst.findIndex((x) => x.client_code == cl_code) != -1);
  }
  ClientValidators(__clMst): AsyncValidatorFn {
    console.log(__clMst);

    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.checkIfclientExist(control.value, __clMst).pipe(
        map((res) => {
          console.log(__clMst);

          if (control.value) {
            return res ? null : { ClientExists: true };
          }
          return null;
        })
      );
    };
  }

  checkIfSubBrokerExist(subBrk: string, __subbrkArnMst): Observable<boolean> {
    return of(__subbrkArnMst.findIndex((x) => x.code == subBrk) != -1);
  }
  SubBrokerValidators(__subbrkArnMst): AsyncValidatorFn {
    console.log(__subbrkArnMst);

    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.checkIfSubBrokerExist(control.value, __subbrkArnMst).pipe(
        map((res) => {
          if (control.value) {
            return res ? null : { subBrkExists: true };
          }
          return null;
        })
      );
    };
  }

  checkIfEuinExists(emp_name: string, __euinMst): Observable<boolean> {
    if (global.containsSpecialChars(emp_name)) {
      return of(
        __euinMst.findIndex((x) => x.euin_no == emp_name.split(' ')[0]) != -1
      );
    } else {
      return of(__euinMst.findIndex((x) => x.euin_no == emp_name) != -1);
    }
  }
  EUINValidators(__euinMst): AsyncValidatorFn {
    console.log(__euinMst);

    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.checkIfEuinExists(control.value, __euinMst).pipe(
        map((res) => {
          if (control.value) {
            // if res is true, sip_date exists, return true
            return res ? null : { euinExists: true };
            // NB: Return null if there is no error
          }
          return null;
        })
      );
    };
  }
  convertFormData(obj) {
    const formData = new FormData();
    Object.keys(obj).forEach((key) => formData.append(key, (obj[key] ? obj[key] : '')));
    return formData;
  }

  /**
   * map id from array and get array of string
   * @param arr
   * @param key
   * @returns
   */
  mapIdfromArray = (arr,key) =>{
     return JSON.stringify(arr.map(item => {return item[key]}))
  }


  public cancelPendingRequests = () => {
    this.cancelPendingRequests$.next()
  }

  public onCancelPendingRequests = () =>{
    return this.cancelPendingRequests$.asObservable()
  }

  getColumns = (columns) =>{
    return columns.map(item => {return item.field});
  }

  /**
   *
   * @param msg is to be encrypted
   * @returns the encrypted string if error happens it will return `ERROR`
   */
  encrypt_dtls = (msg:string): string | null =>{
    try{
      let encrypted_dt =  CryptoJs.AES.encrypt(msg?.trim(),EN_DE?.trim()).toString();
      return encrypted_dt;
    }
    catch(ex){
      console.log(ex);
      return this.decrypt_dtls(ERRR);
    }
  }

    /**
   *
   * @param msg is to be decrypted
   * @returns the encrypted string if error happens it will return `ERROR`
   */
    decrypt_dtls = (encrypt_msg:string): string =>{
      try{
        let dcrypt_dt = CryptoJs.AES.decrypt(encrypt_msg?.trim(), EN_DE?.trim()).toString(CryptoJs.enc.Utf8);
        return  dcrypt_dt;
      }
      catch(ex){
        console.log(ex);
        return null;
      }

    }

  // arrayCount<T>(arr: T[], predicate: (elem: T, idx: number) => boolean):Promise<number> {
  //   return new Promise((resolve,reject) =>{
  //     resolve(arr.reduce((prev, curr, idx) => prev + (predicate(curr, idx) ? 1 : 0), 0)),
  //     reject(0)

  //   })
  //   }

    EncryptText = (text) => {
    try{
            const key = CryptoJs.PBKDF2(HASH_EN_DE, 'salt', { keySize: 256/32, iterations: 100 });
            const iv = CryptoJs.enc.Utf8.parse(AES_IV);
            const encrypted = CryptoJs.AES.encrypt(text, key, { iv: iv, mode: CryptoJs.mode.CBC });
            return encrypted.ciphertext.toString(CryptoJs.enc.Hex);
    }
    catch(err){
            console.log(err);
            return 'ERR';
    }

}

  DcryptText =  (encrypted_text) => {
    try{
            const key = CryptoJs.PBKDF2(HASH_EN_DE, 'salt', { keySize: 256/32, iterations: 100 });
            const iv = CryptoJs.enc.Utf8.parse(AES_IV);
            const decrypted = CryptoJs.AES.decrypt({ ciphertext: CryptoJs.enc.Hex.parse(encrypted_text) }, key, { iv: iv, mode: CryptoJs.mode.CBC });
            return decrypted.toString(CryptoJs.enc.Utf8);
    }
    catch(err){
            console.log(err)
            return 'ERR';
    }
   
}
}
