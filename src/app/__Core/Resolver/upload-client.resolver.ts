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
export class UploadClientResolver implements Resolve<any> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const id: string | null = atob(route.paramMap.get("id"));
    // other route params are in route.paramMap
    return of({
      breadcrumb: id == 'M' ? 'Upload Minor' : (id == 'P' ? 'Upload PAN Holder' : (id == 'N' ?  'Upload Non PAN Holder' : 'Upload Existing')),
      id: 2,
      title: 'NuEdge - Upload Client Master',
      pageTitle: 'Upload Client Master',
      has_menubar: 'Y',
      parentId: 4
    });
  }
}
