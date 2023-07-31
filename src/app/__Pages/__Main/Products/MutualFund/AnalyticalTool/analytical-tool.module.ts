import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticalToolComponent } from './analytical-tool.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
  path:'',
  component:AnalyticalToolComponent,
  data:{breadcrumb:'Analytical Tool'},
  children:[
    {
      path:'home',
      loadChildren:()=> import('./Home/home.module').then(m => m.HomeModule),
      data:{title:"NuEdge - Analytical Tool",pageTitle:"Analytical Tool"}
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
    AnalyticalToolComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class AnalyticalToolModule { }
