import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClExistOrAddnewComponent } from './clExistOrAddnew.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{path:'',component:ClExistOrAddnewComponent}]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ClExistOrAddnewComponent]
})
export class ClExistOrAddnewModule { }
