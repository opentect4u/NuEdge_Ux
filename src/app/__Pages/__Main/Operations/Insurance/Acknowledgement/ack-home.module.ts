import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AckHomeComponent } from './ack-home.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { AckSearchRPTComponent } from './Dialog/Entry/ack-search-rpt/ack-search-rpt.component';
import { AckEntryComponent } from './Dialog/Entry/ack-entry/ack-entry.component';
import { AckRPTComponent } from './Dialog/Report/ack-rpt.component';

const routes: Routes = [{
  path:'',
  component:AckHomeComponent,
  data:{breadcrumb:'Acknowledgement Trax'}
}]

@NgModule({
  declarations: [
    AckHomeComponent,
    AckSearchRPTComponent,
    AckEntryComponent,
    AckRPTComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class AckHomeModule { }
