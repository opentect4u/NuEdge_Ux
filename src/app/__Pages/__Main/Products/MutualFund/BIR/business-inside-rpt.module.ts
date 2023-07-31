import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessInsideRPTComponent } from './business-inside-rpt.component';
import { RouterModule, Routes } from '@angular/router';

 const routes: Routes = [
  {
    path:'',
    component:BusinessInsideRPTComponent,
    data:{breadcrumb:'Business Insight Report'},
    children:[
      {
        path:'home',
        loadChildren:()=> import('./Home/home.module').then(m => m.HomeModule),
        data:{title:' Business Insight Report',pageTitle:'Business Insight Report'}
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
    BusinessInsideRPTComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class BusinessInsideRPTModule { }
