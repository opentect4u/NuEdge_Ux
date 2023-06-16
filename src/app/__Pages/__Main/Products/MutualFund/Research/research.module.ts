import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResearchComponent } from './research.component';
import { RouterModule, Routes } from '@angular/router';

 const routes: Routes = [
  {
  path:'',
  component:ResearchComponent,
  data:{breadcrumb:'Research'},
  children:[
    {
    path:'home',
    loadChildren:()=> import('./Home/home.module').then(m => m.HomeModule)
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
    ResearchComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ResearchModule { }
