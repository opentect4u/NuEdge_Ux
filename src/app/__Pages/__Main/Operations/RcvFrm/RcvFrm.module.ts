import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RcvFrmComponent } from './RcvFrm.component';
import { RouterModule, Routes } from '@angular/router';
import { SearchModule } from 'src/app/__Core/search/search.module';
const routes:Routes= [{path:'',component:RcvFrmComponent}]
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SearchModule,
  ],
  declarations: [RcvFrmComponent]
})
export class RcvFrmModule {
  constructor() {
     console.log('Recieve Form Module Loaded');
  }
 }
