import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GaurdChildGuard implements CanActivate, CanActivateChild {
  /**
   * @description This method is used to check if the route can be activated.
   * It returns true, allowing the route to be activated.
   * This is a placeholder implementation and can be modified as needed.
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
  /**
   * @description This method is used to check if the child route can be activated.
   * It returns true, allowing the child route to be activated.
   * This is a placeholder implementation and can be modified as needed.
   */
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
  
}
