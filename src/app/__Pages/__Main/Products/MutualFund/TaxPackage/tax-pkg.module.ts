import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaxPkgComponent } from './tax-pkg.component';
import { RouterModule, Routes } from '@angular/router';

 const routes : Routes = [
  {
    path:'',
    component:TaxPkgComponent,
    data:{breadcrumb:'Tax Package'},
    children:[
      {
        path:'home',
        loadChildren:()=> import('./Home/home.module').then(m => m.HomeModule)
      },
      {
        path:'combineportfolio',
        loadChildren:()=> import('./CmbPortFolioRPT/cmb-port-folio-rpt.module').then(m => m.CmbPortFolioRptModule)
      },
      {
        path:'',
        redirectTo:'home',
        pathMatch:'full'
      }
    ]

   }]

@NgModule({
  declarations: [
    TaxPkgComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class TaxPkgModule { }
