import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmcDashBoradComponent } from './amcDashBorad.component';
import { RouterModule, Routes } from '@angular/router';

 const routes: Routes = [{path:'',component:AmcDashBoradComponent}]


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AmcDashBoradComponent]
})
export class AmcDashBoradModule { }
