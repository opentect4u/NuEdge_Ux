import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinPlanComponent } from './fin-plan.component';
import { Routes, RouterModule } from '@angular/router';

 const routes: Routes = [
  {
   path:'',
   component:FinPlanComponent,
   data:{breadcrumb:'Financial Planning'},
   children:[
    {
      path:'home',
      loadChildren:()=> import('./Home/home.module').then(m => m.HomeModule)
    },
    {
      path:'planner',
      loadChildren:()=> import('./Planner/planner.module').then(m => m.PlannerModule)
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
    FinPlanComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class FinPlanModule { }
