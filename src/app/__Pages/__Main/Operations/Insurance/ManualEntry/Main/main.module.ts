import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { RouterModule, Routes } from '@angular/router';

 const routes: Routes = [
  {
    path:'',
    component:MainComponent,
    data:{breadcrumb:'Insurance Trax'},
    children:[
      {
        path:'',
        loadChildren:()=>import('../ins-manual-entry.module').then(m => m.InsManualEntryModule)
      },
      {
        path:'renewalBuOportunity',
        loadChildren:()=> import('../../RenewalBuOporTunity/renewalmain.module').then(m => m.RenewalmainModule)
      }
    ]
  }
 ]

@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class MainModule { }
