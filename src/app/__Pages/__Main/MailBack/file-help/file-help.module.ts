import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileHelpComponent } from './file-help.component';
import { RouterModule, Routes } from '@angular/router';

 const routes:Routes = [{
  path:'',
  component:FileHelpComponent,
  data:{breadcrumb:'File Help'},
  children:[
    {
      path:'',
      loadChildren:() => import('./home/home.module').then(m => m.HomeModule)
    },
    {
      path:'trxntype',
      loadChildren:() => import('./trxn-type/trxn-type.module').then(m => m.TrxnTypeModule)
    }
  ]
}]

@NgModule({
  declarations: [
    FileHelpComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class FileHelpModule { }
