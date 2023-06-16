import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwpTypeComponent } from './swp-type.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
  path:'',
  component:SwpTypeComponent,
  data:{breadcrumb:'SWP Type'},
  children:[
    {
      path:'',
      loadChildren:()=> import('./Dashboard/dashboard.module').then(m => m.DashboardModule)
    }
  ]
}]

@NgModule({
  declarations: [
    SwpTypeComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class SwpTypeModule { }
