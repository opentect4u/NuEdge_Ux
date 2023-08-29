import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MergeRplcAcqComponent } from './merge-rplc-acq.component';
import { ActivatedRouteSnapshot, Resolve, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
import { Observable, of } from 'rxjs';


export class mergeRplceAcqResolver implements Resolve<any> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {

    const id: number = Number(atob(route.paramMap.get("id")));
    // other route params are in route.paramMap
    return of({
      breadcrumb:  id == 46 ? 'Merge' : (id == 47 ? 'Replace' : 'Acquisition'),
      title: 'NuEdge -' + (id == 46 ? 'Merge' : (id == 48 ? 'Replace' : 'Acquisition')),
      pageTitle: (id == 46 ? 'Merge' : (id == 49 ? 'Replace' : 'Acquisition')),
      has_menubar: 'Y',
      parentId: 4
    });
  }
}


 const routes:Routes = [{
  path:':id',
  component:MergeRplcAcqComponent,
  resolve:{
    data:mergeRplceAcqResolver
  },
  children:[
    {
      path:'',
      loadChildren:()=>import('./home/home.module').then(m=>m.HomeModule)
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
  providers:[mergeRplceAcqResolver]
})
export class MergeRplcAcqModule { }




