import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientResolverResolver implements Resolve<any> {
  /**
   * @description This resolver is used to resolve the route parameters for the Client Master component.
   * It retrieves the id from the route parameters, decodes it, and returns an observable with the resolved data.
   * The resolved data includes breadcrumb, id, title, pageTitle, has_menubar, and parentId.
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {

    const id: string | null = atob(route.paramMap.get("id"));
    // other route params are in route.paramMap
    return of({
      breadcrumb: id == 'M' ? 'Minor' : (id == 'P' ? 'PAN Holder' : (id == 'N' ?  'Non PAN Holder' : 'Existing')),
      id: 2,
      title: 'NuEdge - Client Master',
      pageTitle: 'Client Master',
      has_menubar: 'Y',
      parentId: 4
    });
  }
}
