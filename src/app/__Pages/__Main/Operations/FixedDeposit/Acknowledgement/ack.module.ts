import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AckComponent } from './ack.component';
import { AckRPTComponent } from './Dialog/ack-rpt/ack-rpt.component';
import { AckEntryComponent } from './Dialog/ack-entry/ack-entry.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { AckSearchRPTComponent } from './Dialog/ack-search-rpt/ack-search-rpt.component';

const routes: Routes = [{
  path:'',
  component:AckComponent,
  data:{breadcrumb:'Acknowledgement Trax'}
}]

@NgModule({
  declarations: [
    AckComponent,
    AckRPTComponent,
    AckEntryComponent,
    AckSearchRPTComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class AckModule { }
