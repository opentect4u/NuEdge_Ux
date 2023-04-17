import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FDCertificateComponent } from './fdcertificate.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { EntryComponent } from './Dialog/entry/entry.component';
import { SearchRPTComponent } from './Dialog/search-rpt/search-rpt.component';
import { ReportComponent } from './Dialog/report/report.component';

 const routes: Routes = [{path:'',component:FDCertificateComponent}]

@NgModule({
  declarations: [
    FDCertificateComponent,
    EntryComponent,
    SearchRPTComponent,
    ReportComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class FDCertificateModule { }
