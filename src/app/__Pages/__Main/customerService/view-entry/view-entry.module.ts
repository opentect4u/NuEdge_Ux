import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewEntryComponent } from './view-entry.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const routes:Routes = [
  {
    path:'',
    component:ViewEntryComponent
  }
];

@NgModule({
  declarations: [
    ViewEntryComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class ViewEntryModule { }
