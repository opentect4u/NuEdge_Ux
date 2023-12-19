import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { storage } from 'src/app/__Utility/storage';
import { AU_TK } from 'src/app/strings/localStorage_key';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):boolean  {
      console.log('CanActivate called');
      // let isLoggedIn = this.authService.isAuthenticated();
      let isLoggedIn = storage.getItemFromLocalStorage(AU_TK);
      if (isLoggedIn){
        return true;
      }
      this.router.navigate(['/']);
        return false;
  }

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
