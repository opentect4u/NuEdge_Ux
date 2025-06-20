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
export class RcvFrmResolver implements Resolve<any> {
  /**
   * @description This resolver is used to resolve the route parameters for the RcvFrm component.
   * It retrieves the type_id from the route parameters, decodes it, and returns an observable with the resolved data.
   * The resolved data includes breadcrumb, id, title, pageTitle, has_menubar, and parentId.
   * 
   * @param route - The activated route snapshot containing the route parameters.
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{breadcrumb:string | null,id:number,title:string,pageTitle:string,has_menubar:string | null,parentId:number}> {
    const id: string | null = atob(route.paramMap.get("type_id"));
    // other route params are in route.paramMap
    return of({
      breadcrumb: id == '1' ? 'Financial' : (id == '3' ? 'Non Financial' : 'NFO'),
      id: 2,
      title: 'NuEdge - '+`${id == '1' ? 'Financial' : (id == '3' ? 'Non Financial' : 'NFO')}` +' Form Receivable',
      pageTitle: `${id == '1' ? 'Financial' : (id == '3' ? 'Non Financial' : 'NFO')}` + ' Form Receivable',
      has_menubar: 'Y',
      parentId: 4
    });
  }
}
