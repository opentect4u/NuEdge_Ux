import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonfinancialComponent } from './nonfinancial.component';
import { RPTComponent } from './Dialog/rpt/rpt.component';
import { SearchRPTComponent } from './Dialog/search-rpt/search-rpt.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

 const routes: Routes = [{path:'',component:NonfinancialComponent}]

@NgModule({
  declarations: [
    NonfinancialComponent,
    RPTComponent,
    SearchRPTComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class NonfinancialModule { }
