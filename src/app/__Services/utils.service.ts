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


  private userDtls  = new BehaviorSubject<any>(null);
  public readonly __userDtls$ = this.userDtls.asObservable().pipe(delay(1));


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

  /**
   * @description This function is used to navigate to a specific route.
   * @param __route_url - The URL of the route to navigate to.
   * @param __params - Optional parameters to pass to the route.
   * If __params is provided, it will be appended to the URL.
   * If __params is null, it will navigate without any parameters.
   */
  navigate(__route_url, __params: any | null = null) {
    if (__params) {
      this.__router.navigate([__route_url, __params]);
    } else {
      this.__router.navigate([__route_url]);
    }
  }
  /**
   * @description This function is used to navigate to a specific route with query parameters.
   * @param url - The URL of the route to navigate to.
   */
  navigatewithqueryparams(url, _params) {
    this.__router.navigate([url], _params);
  }
  //Get Route Details
  /**
   * @description This function is used to set the current route.
   * It updates the __route BehaviorSubject with the provided route details.
   * @param __route - The route details to set.
   */
  getRoute(__route) {
    this.__route.next(__route);
  }

  /**
   * @description This function is used to set the visibility of the menu icon.
   * It updates the __isvisibleMenuIcon BehaviorSubject with the provided visibility status.
   * @param isVisible - A boolean value indicating whether the menu icon should be visible or not.
   */
  getmenuIconVisible(isVisible) {
    this.__isvisibleMenuIcon.next(isVisible);
  }

  /**
   * @description This function is used to set the breadcrumb navigation.
   * It updates the __brdCrumbs BehaviorSubject with the provided breadcrumb array.
   * @param __brcrmbs - An array of breadcrumb objects to set.
   * Each breadcrumb object should contain properties like label, url, and icon.
   */
  getBreadCrumb(__brcrmbs) {
    this.__brdCrumbs.next(__brcrmbs);
  }

  /**
   * @description This function is used to set the latest breadcrumb navigation.
   * It updates the __latestBrdCrmbs BehaviorSubject with the provided breadcrumb array.
   * @param __brdCrmbs - An array of breadcrumb objects to set.
   * Each breadcrumb object should contain properties like label, url, and icon.
   */
  getLatestBrdCrmbs(__brdCrmbs){
    this.__latestBrdCrmbs.next(__brdCrmbs);
  }

  /**
   * @description This function is used to set the breakpoint status.
   * It updates the breakPointObserver BehaviorSubject with the provided breakpoints.
   * @param breakpoints - The breakpoints to set.
   * This can be used to track changes in the application's layout or responsiveness.
   */
   getBreakpoinStatus = (breakpoints) =>{
    this.breakPointObserver.next(breakpoints);
   }
/**
 * @description This function is used to set the authenticated user details.
 * It updates the userDtls BehaviorSubject with the provided user details.
 * @param user_details - The details of the authenticated user.
 * This can include information such as username, email, roles, etc.
 */
   getAuthenticatedUserDetails = (user_details) =>{
      this.userDtls.next(user_details);
   }

   /**
    * @description This function is used to add a script to the document.
    * It creates a script element with the specified source and appends it to the document body.
    * This can be used to dynamically load external JavaScript files.
    * @memberof UtiliService
    */
  //Adding Dropdown Script
  addScript() {
    let __script = this.__renderer.createElement('script');
    __script.src = './assets/js/appendselect2.js';
    __script.id = 'mainJquery';
    this.__renderer.appendChild(this.__docs.body, __script);
  }
  /**
   * @description This function is used to remove the script with the specified ID from the document.
   * It checks if the script element with the given ID exists in the document and removes it if found.
   * This can be used to clean up dynamically added scripts when they are no longer needed.
   * @memberof UtiliService
   */
  //Remove dropdown script
  destroyScript() {
    if (<HTMLElement>this.__docs.getElementById('mainJquery')) {
      this.__docs.getElementById('mainJquery').remove();
    }
  }

  /**
   * @description This function is used to show a snackbar message.
   * It opens a snackbar component with the specified message, icon, and success status.
   */
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
  /**
   * @description This function is used to close the snackbar.
   * It dismisses the currently open snackbar, if any.
   * This can be used to hide the snackbar message programmatically.
   */
  closeSnackBar(){
    this._snackBar.dismiss();
  }

  /**
   * @description This function is used to create settings for a multi-select dropdown.
   * It returns an object containing various configuration options for the dropdown.
   */
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

  /**
   * @description This function checks if a client exists in the provided client master array.
   * It returns an observable that emits true if the client exists, false otherwise.
   * @param cl_code - The client code to check for existence.
   * @param __clMst - The array of client master objects to search in.
   * @returns An observable that emits true if the client exists, false otherwise.
   */
  checkIfclientExist(cl_code: string, __clMst): Observable<boolean> {
    return of(__clMst.findIndex((x) => x.client_code == cl_code) != -1);
  }
  /**
   * @description This function is an asynchronous validator for checking if a client exists.
   * It takes the client master array as an argument and returns an AsyncValidatorFn.
   * The validator checks if the control value (client code) exists in the client master array.
   */
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

  /**
   * @description This function checks if a sub-broker exists in the provided sub-broker master array.
   * It returns an observable that emits true if the sub-broker exists, false otherwise.
   * @param subBrk - The sub-broker code to check for existence.
   * @param __subbrkArnMst - The array of sub-broker master objects to search in.
   * @returns An observable that emits true if the sub-broker exists, false otherwise.
   */
  checkIfSubBrokerExist(subBrk: string, __subbrkArnMst): Observable<boolean> {
    return of(__subbrkArnMst.findIndex((x) => x.code == subBrk) != -1);
  }
  /**
   * @description This function is an asynchronous validator for checking if a sub-broker exists.
   * It takes the sub-broker master array as an argument and returns an AsyncValidatorFn
   */
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

  /**
   * @description This function checks if an EUIN (Employee Unique Identification Number) exists in the provided EUIN master array.
   * It returns an observable that emits true if the EUIN exists, false otherwise.
   * @param emp_name - The EUIN to check for existence.
   * @param __euinMst - The array of EUIN master objects to search in.
   * @returns An observable that emits true if the EUIN exists, false otherwise.
   */
  checkIfEuinExists(emp_name: string, __euinMst): Observable<boolean> {
    if (global.containsSpecialChars(emp_name)) {
      return of(
        __euinMst.findIndex((x) => x.euin_no == emp_name.split(' ')[0]) != -1
      );
    } else {
      return of(__euinMst.findIndex((x) => x.euin_no == emp_name) != -1);
    }
  }
  /**
   * @description This function is an asynchronous validator for checking if an EUIN exists.
   * It takes the EUIN master array as an argument and returns an AsyncValidatorFn.
   * The validator checks if the control value (EUIN) exists in the EUIN master array.
   * If the EUIN exists, it returns null; otherwise, it returns an error object indicating that the EUIN already exists.
   */
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
  /**
   * @description This function converts an object to FormData format.
   * It creates a new FormData object and appends each key-value pair from the object to the FormData.
   * If a value is null or undefined, it appends an empty string for that key.
   * @param obj - The object to be converted to FormData.
   * @returns A FormData object containing the key-value pairs from the input object.
   */
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
     return JSON.stringify(arr.map(item => {return item[key] ? item[key] : ''}))
  }

  /**
   * @description This function is used to cancel any pending requests. 
   * It emits a value on the cancelPendingRequests$ subject, which can be subscribed to by other components or services to handle cancellation logic.
   * This can be useful in scenarios where you want to abort ongoing HTTP requests, such as when navigating away from a component or when a user initiates a new request that should override the previous one.
   * @memberof UtiliService
   */
  public cancelPendingRequests = () => {
    this.cancelPendingRequests$.next()
  }

  /**
   * @description This function returns an observable that emits when pending requests should be canceled.
   * Other components or services can subscribe to this observable to be notified when pending requests should be canceled.
   * This can be useful for cleaning up resources or aborting ongoing HTTP requests when the user navigates away from a component or when a new request is initiated.
   * @returns An observable that emits when pending requests should be canceled.
   */
  public onCancelPendingRequests = () =>{
    return this.cancelPendingRequests$.asObservable()
  }

  /**
   * @description This function extracts the field names from an array of column objects.
   * It maps over the array and returns an array of field names.
   */
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

  /**
   * @description This function encrypts a given text using AES encryption.
   * It uses a key derived from a password and a salt, along with an initialization vector (IV).
   * The encrypted text is returned as a hexadecimal string.
   */
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

  /**
   * @description This function decrypts a given encrypted text using AES decryption.
   * It uses a key derived from a password and a salt, along with an initialization vector (IV).
   * The decrypted text is returned as a UTF-8 string.
   * If an error occurs during decryption, it logs the error and returns 'ERR'.
   */
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
