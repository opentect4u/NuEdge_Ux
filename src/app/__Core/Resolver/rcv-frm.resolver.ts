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
