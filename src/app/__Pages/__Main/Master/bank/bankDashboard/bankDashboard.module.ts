import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankDashboardComponent } from './bankDashboard.component';
import { RouterModule, Routes } from '@angular/router';

 const routes: Routes = [{
  path:'',
  component:BankDashboardComponent,
  data:{breadcrumb:'Bank'},
  children:[
      {
        path: '',
        loadChildren: () =>
          import('../bank.module').then((m) => m.BankModule),
      },
      {
        path: 'uploadbnk',
        loadChildren: () =>
          import('../bankUpload/bankUpload.module').then(
            (m) => m.BankUploadModule
          ),
        data: {
          parentId: 4,
          id: 27,
          breadcrumb:'Upload Bank',
          title: 'NuEdge - Bank Uploadation',
          pageTitle: 'Bank Upload',
          has_menubar: 'Y',
        },
      }
  ]
}]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BankDashboardComponent]
})
export class BankDashboardModule { }
