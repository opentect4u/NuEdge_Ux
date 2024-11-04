import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QueryDtlsComponent } from './query-dtls.component';
import { RouterModule, Routes } from '@angular/router';

const routes:Routes = [{
      path:'',
      component:QueryDtlsComponent
}]

@NgModule({
  declarations: [
    QueryDtlsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class QueryDtlsModule { }
