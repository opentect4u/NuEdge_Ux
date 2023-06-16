import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmbPortFolioRptComponent } from './cmb-port-folio-rpt.component';
import { RouterModule, Routes } from '@angular/router';

 const routes: Routes = [{
  path:'',
  component:CmbPortFolioRptComponent,
  data:{breadcrumb:'Combined Portfolio Report'},
  children:[
    {
      path:'home',
      loadChildren:()=> import('./Home/home.module').then(m => m.HomeModule)
    },
    {
      path:'',
      redirectTo:'home'
    }
]
}]

@NgModule({
  declarations: [
    CmbPortFolioRptComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class CmbPortFolioRptModule { }
