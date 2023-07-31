import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AumComponent } from './aum.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
  path:'',
  component:AumComponent,
  data:{breadcrumb:'AUM Report'},
  children:[
    {
      path:'home',
      loadChildren:()=> import('./Home/home.module').then(m => m.HomeModule),
      data:{title:"NuEdge - AUM Report",pageTitle:"AUM Report"}
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
    AumComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class AumModule { }
