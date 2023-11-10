import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../__Services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):boolean  {
      console.log('CanActivate called');
      let isLoggedIn = this.authService.isAuthenticated();
      if (isLoggedIn){
        return true;
      }
      this.router.navigate(['/']);
        return false;
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean{
      let isLoggedIn = this.authService.isAuthenticated();
      if (isLoggedIn){
        return true;
      }
      this.router.navigate(['/']);
        return false;
  }

}
