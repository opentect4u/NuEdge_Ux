import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StpMainComponent } from './stp-main.component';
import { RouterModule, Routes } from '@angular/router';

const routes:Routes = [
  {
    path:'',
    component:StpMainComponent,
    data:{breadcrumb:'STP Report'},
    children:[
          {
            path:'',
            loadChildren:()=>import('./stp-home/stp-home.module').then(m=> m.StpHomeModule)
          }
    ]
  }
]

@NgModule({
  declarations: [
    StpMainComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class StpMainModule { }
