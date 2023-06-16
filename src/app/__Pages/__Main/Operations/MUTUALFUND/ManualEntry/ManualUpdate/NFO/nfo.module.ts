import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NfoComponent } from './nfo.component';
import { RPTComponent } from './Dialog/rpt/rpt.component';
import { SearchRPTComponent } from './Dialog/search-rpt/search-rpt.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

 const routes: Routes =[{path:'',component:NfoComponent}]

@NgModule({
  declarations: [
    NfoComponent,
    RPTComponent,
    SearchRPTComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class NfoModule { }
