import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QueryDeskReportComponent } from './query-desk-report.component';
import { RouterModule, Routes } from '@angular/router';
import { TabModule } from 'src/app/__Core/tab/tab.module';
import { EntryModelDialogModule } from '../EntryModelDialog/entry-model-dialog.module';

const routes:Routes = [
  {
    path:'',
    component:QueryDeskReportComponent,
    data:{breadcrumb:'Query Desk Report',title:'Query Desk Report',pageTitle:'Query Desk Report'}
  }
]

@NgModule({
  declarations: [
    QueryDeskReportComponent
  ],
  imports: [
    CommonModule,
    TabModule,
    EntryModelDialogModule,
    RouterModule.forChild(routes)
  ],
  exports:[
    EntryModelDialogModule
  ]
})
export class QueryDeskReportModule { }
