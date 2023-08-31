import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MergeRplcAcqComponent } from './merge-rplc-acq.component';
import { ActivatedRouteSnapshot, Resolve, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
import { Observable, of } from 'rxjs';
/**
 * Resolver For Fetting Breadcrumb dynamically for Merge/Replace/Acquisition - AMC/SCHEME
 */
@Injectable()
export class childResolver implements Resolve<string> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const flag: string | null = atob(route.paramMap.get("flag"));
    return of({breadcrumb:flag == 'A' ? 'AMC' : 'Scheme'});
  }
}
/*********************** * END ********************************/

/**
 * Resolver For Fetting Breadcrumb dynamically for Merge/Replace/Acquisition
 */

@Injectable()
export class ParentResolver implements Resolve<string> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const id: string | null = atob(route.paramMap.get("id"));
    return of({
      breadcrumb:id == '46' ? 'Merge' : (id == '47' ? 'Replace' : 'Acquisition'),
      id:atob(route.paramMap.get("id"))
    });
  }
}
/*********************** * END ********************************/


const routes:Routes = [
  {
    path:':id',
    component:MergeRplcAcqComponent,
    resolve:{
          data:ParentResolver
    },
    children:[
      {
        path:'',
        loadChildren:()=> import('./home/home.module').then(m=>m.HomeModule)
      },
      {
        path:':flag',
        loadChildren:()=>import('./mrg_Rplc_Acq_Amc_Scm/mrg-rplc-acq-home.module').then(m => m.MrgRplcAcqHomeModule),
        resolve:{
          data: childResolver
        }
      }
    ]
}]


@NgModule({
  declarations: [
    MergeRplcAcqComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  providers:[childResolver,ParentResolver]
})
export class MergeRplcAcqModule { }




