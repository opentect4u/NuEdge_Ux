import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InsHomeComponent } from './ins-home.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{path:'',component:InsHomeComponent}]

@NgModule({
  declarations: [
    InsHomeComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class InsHomeModule { }
