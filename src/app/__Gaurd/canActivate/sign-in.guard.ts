import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/__Services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SignInGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router){}
  /**
   * @description This method is used to check if the user can activate the route.
   * It checks if the user is authenticated. If not, it allows access to the route.
   * If the user is authenticated, it redirects to the main page.
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):boolean  {
      // console.log('CanActivate called');
      let isLoggedIn = this.authService.isAuthenticated();
      if (!isLoggedIn){
        // this.router.navigate(['/']);
        // console.log('LOGIN')
        return true;
      }
        this.router.navigate(['/main']);
        return false;
  }



}
