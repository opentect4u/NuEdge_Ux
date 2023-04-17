import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinancialComponent } from './financial.component';
import { RouterModule, Routes } from '@angular/router';
import { RPTComponent } from './Dialog/rpt/rpt.component';
import { SearchRPTComponent } from './Dialog/search-rpt/search-rpt.component';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes=[{path:'',component:FinancialComponent}]

@NgModule({
  declarations: [
    FinancialComponent,
    RPTComponent,
    SearchRPTComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class FinancialModule { }
