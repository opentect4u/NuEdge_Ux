import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QueryFeedbackComponent } from './query-feedback.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';


const route:Routes = [
    {
      path:'',
      component:QueryFeedbackComponent
    }
]

@NgModule({
  declarations: [
    QueryFeedbackComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    SharedModule
  ]
})
export class QueryFeedbackModule { }
