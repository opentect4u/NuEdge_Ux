import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MFTraxComponent } from './mftrax.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { MftraxModificationComponent } from './dialog/mftrax-modification/mftrax-modification.component';
import { MfTraxReportComponent } from './dialog/mf-trax-report/mf-trax-report.component';

const routes: Routes = [
  {
    path:'',
    component:MFTraxComponent,
    data:{breadcrumb:'MF Trax',pageTitle:"MF Trax",title:'MF Trax'}
  }]

@NgModule({
  declarations: [
    MFTraxComponent,
    MftraxModificationComponent,
    MfTraxReportComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class MFTraxModule { }
