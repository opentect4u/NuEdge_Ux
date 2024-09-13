import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QueryDeskHomeComponent } from './query-desk-home.component';
import { RouterModule, Routes } from '@angular/router';
// import { SharedModule } from 'src/app/shared/shared.module';
import { EntryModelDialogModule } from '../EntryModelDialog/entry-model-dialog.module';

const routes:Routes = [
  {
    path:'',
    component:QueryDeskHomeComponent
  }
]

@NgModule({
  declarations: [
    QueryDeskHomeComponent
  ],
  imports: [
    CommonModule,
    EntryModelDialogModule,
    RouterModule.forChild(routes)
  ],
  exports:[
    EntryModelDialogModule
  ]
})
export class QueryDeskHomeModule { }
