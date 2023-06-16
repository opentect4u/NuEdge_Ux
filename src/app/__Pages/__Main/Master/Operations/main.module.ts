import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { RouterModule, Routes } from '@angular/router';

 const route: Routes =[
  {
    path:'',
    component:MainComponent,
    data:{breadcrumb:'Operations'},
    children:[
      {
        path:'home',
        loadChildren:()=> import('./Home/home.module').then(m => m.HomeModule)
      },
      {
        path:'clntMst',
        loadChildren:()=> import('./cl-mst/cl-mst.module').then(m => m.ClMstModule)
      },
      {
        path:'',
        redirectTo:'home',
        pathMatch:'full'
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
    RouterModule.forChild(route)
  ]
})
export class MainModule { }
