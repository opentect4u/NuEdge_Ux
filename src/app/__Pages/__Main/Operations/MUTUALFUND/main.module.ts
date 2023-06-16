import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { RouterModule, Routes } from '@angular/router';

 const routes: Routes = [{
  path:'',
  component:MainComponent,
  data:{breadcrumb:'Mutual Fund'},
  children:[
    {
       path:'',
       loadChildren:()=> import('./Home/home.module').then(m => m.HomeModule)
    },
    {
       path:'formRcv',
       loadChildren:()=> import('./RcvForm/main.module').then(m => m.MainModule)
    },
    {
      path:'manualEntr',
      loadChildren:()=> import('./ManualEntry/main.module').then(m => m.MainModule),
    },
    {
      path:'report',
      loadChildren:()=> import('./Report/report.module').then(m => m.ReportModule)
    }
  ]
}]

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
