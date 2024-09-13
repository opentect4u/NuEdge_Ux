import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { QueryDeskLayoutComponent } from './query-desk-layout.component';

const routes:Routes = [
      {
        path:'',
        component:QueryDeskLayoutComponent,
        children:[
          {
            path:'dashboard',
            loadChildren:() => import('./QueryDeskHome/query-desk-home.module').then(m => m.QueryDeskHomeModule),
            // data:{breadcrumb:'Query Desk Dashboard'}
          },
          {
             path:'report',
             loadChildren:() => import('./query-desk-report/query-desk-report.module').then(m => m.QueryDeskReportModule),
            
          },
          {
            path:'',
            redirectTo:'dashboard',
            pathMatch:'full'
          }
        ]
      }
]

@NgModule({
  declarations: [QueryDeskLayoutComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class QueryDeskLayoutModule { }
