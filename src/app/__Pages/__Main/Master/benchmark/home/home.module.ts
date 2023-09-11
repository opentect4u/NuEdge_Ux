import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import {Routes,RouterModule} from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { BenchmarkEntryComponent } from '../Dialog/benchmark-entry/benchmark-entry.component';
import { BenchmarkReportComponent } from '../Dialog/benchmark-report/benchmark-report.component';
const routes:Routes = [{path:'',component:HomeComponent}]

@NgModule({
  declarations: [
    HomeComponent,
    BenchmarkEntryComponent,
    BenchmarkReportComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class HomeModule { }
