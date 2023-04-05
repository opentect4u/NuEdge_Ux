import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FixdepositHomeComponent } from './fixdeposit-home.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
    path:'',component:FixdepositHomeComponent
}]

@NgModule({
  declarations: [
    FixdepositHomeComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class FixdepositHomeModule { }
