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
