import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RenewalDashboardComponent } from './renewal-dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { EntryComponent } from './Dialog/entry/entry.component';
import { ReportComponent } from './Dialog/report/report.component';
import { InputTextModule } from 'primeng/inputtext';
const routes: Routes = [
  {
    path:'',
    component:RenewalDashboardComponent
  }
]

@NgModule({
  declarations: [
    RenewalDashboardComponent,
    EntryComponent,
    ReportComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    InputTextModule,
    RouterModule.forChild(routes)
  ]
})
export class RenwalDashboardModule { }
