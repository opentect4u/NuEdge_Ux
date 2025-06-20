import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { storage } from 'src/app/__Utility/storage';
import { AU_TK } from 'src/app/strings/localStorage_key';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router){}
  /**
   * @description This method is used to check if the route can be activated.
   * It checks if the user is authenticated by checking the local storage for a token.
   * If the user is authenticated, it returns true; otherwise, it redirects to the home page.
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):boolean  {
      // console.log('CanActivate called');
      // let isLoggedIn = this.authService.isAuthenticated();
      let isLoggedIn = storage.getItemFromLocalStorage(AU_TK);
      // console.log(isLoggedIn)
      if (isLoggedIn){
        return true;
      }
      this.router.navigate(['/']);
        return false;
  }
  /**
   * @description This method is used to check if the child route can be activated.
   * It checks if the user is authenticated by checking the local storage for a token.
   * If the user is authenticated, it returns true; otherwise, it redirects to the home page.
   */
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean{
      // let isLoggedIn = this.authService.isAuthenticated();
      let isLoggedIn = storage.getItemFromLocalStorage(AU_TK);
      if (isLoggedIn){
        return true;
      }
      this.router.navigate(['/']);
        return false;
  }

}
