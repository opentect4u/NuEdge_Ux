import { Injectable } from '@angular/core';
import { AU_TK as AUTH_KEY_TOKEN} from '../strings/localStorage_key';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // isLoggedIn = false;
  constructor() { }
  isAuthenticated(){
    return localStorage.getItem(AUTH_KEY_TOKEN);
  }

  /** Set Token In localstorage */
  // set_Token_in_localStorage(token){
  //   localStorage.setItem(AUTH_KEY_TOKEN,token);
  // }
  /**End */

  /** Get User Details from localstorage */
  // getUserDtls_from_localStorage(){
  //     return JSON.parse(atob(localStorage.getItem(USER_DETAILS)));
  // }
  /*** End */

  /** Set User Details Into localstorage */
  //  setUserDtls_into_localStorage = (dt) => {
  //   localStorage.setItem(USER_DETAILS,btoa(JSON.stringify(dt)));
  // }
  /**End */
}
