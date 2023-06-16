import { Injectable } from '@angular/core';
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ManualEntryResolver implements Resolve<any> {
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    const id: string | null = atob(route.paramMap.get('trans_type_id'));
    // other route params are in route.paramMap
    return of({
      breadcrumb: id == '1' ? 'Financial' : id == '3' ? 'Non Financial' : 'NFO',
      id: 2,
      title:
        'NuEdge - Manual Entry Form For ' +
        (id == '1' ? 'Financial' : id == '3' ? 'Non Financial' : 'NFO'),
      pageTitle:
        'Manual Entry Form For ' +
        (id == '1' ? 'Financial' : id == '3' ? 'Non Financial' : 'NFO'),
      has_menubar: 'Y',
      parentId: 4,
    });
  }
}
