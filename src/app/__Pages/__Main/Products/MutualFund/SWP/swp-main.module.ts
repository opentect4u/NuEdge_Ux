import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwpMainComponent } from './swp-main.component';
import { RouterModule, Routes } from '@angular/router';

const routes:Routes = [
  {
    path:'',
    component:SwpMainComponent,
    data:{breadcrumb:'SWP Report'},
    children:[
          {
            path:'',
            loadChildren:()=>import('./swp-home/swp-home.module').then(m=> m.SwpHomeModule)
          }
    ]
  }
]

@NgModule({
  declarations: [
    SwpMainComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class SwpMainModule { }
