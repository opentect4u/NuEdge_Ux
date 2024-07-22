import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValuationRptDownloadLinkComponent } from './valuation-rpt-download-link.component';
import { RouterModule, Routes } from '@angular/router';


const routes:Routes = [
  {
    path:'',
    component:ValuationRptDownloadLinkComponent
  }
]

@NgModule({
  declarations: [
    ValuationRptDownloadLinkComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ValuationRptDownloadLinkModule { }
