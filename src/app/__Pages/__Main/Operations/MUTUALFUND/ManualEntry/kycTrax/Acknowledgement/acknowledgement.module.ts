import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcknowledgementComponent } from './acknowledgement.component';
import { AckRptComponent } from './Dialog/ack-rpt/ack-rpt.component';
import { AckEntryRptComponent } from './Dialog/ack-entry-rpt/ack-entry-rpt.component';
import { AckEntryComponent } from './Dialog/ack-entry/ack-entry.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

 const routes: Routes = [{
 path:'',
 component:AcknowledgementComponent,
 data:{breadcrumb:'Acknowledgement'}
}]

@NgModule({
  declarations: [
    AcknowledgementComponent,
    AckRptComponent,
    AckEntryRptComponent,
    AckEntryComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class AcknowledgementModule { }
