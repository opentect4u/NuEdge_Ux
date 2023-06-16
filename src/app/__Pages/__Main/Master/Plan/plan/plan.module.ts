import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanComponent } from './plan.component';
import { RouterModule, Routes } from '@angular/router';
import { PlanModificationComponent } from '../planModification/planModification.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PlanrptComponent } from '../planRpt/planRpt.component';


const routes: Routes =[{path:'',component:PlanComponent}]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule

  ],
  declarations: [PlanComponent,PlanModificationComponent,PlanrptComponent]
})
export class PlanModule { }
