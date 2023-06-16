import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlannerComponent } from './planner.component';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from '../../../core/core.module';

 const routes: Routes = [{path:'',component:PlannerComponent,
 data:{breadcrumb:'Planner'},
}]

@NgModule({
  declarations: [
    PlannerComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CoreModule
  ]
})
export class PlannerModule { }
