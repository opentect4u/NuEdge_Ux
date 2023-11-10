import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/__Services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SignInGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router){}
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
