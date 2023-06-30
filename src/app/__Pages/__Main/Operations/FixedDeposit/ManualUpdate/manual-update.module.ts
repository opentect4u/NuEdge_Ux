import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManualUpdateComponent } from './manual-update.component';
import { RouterModule, Routes } from '@angular/router';
import { EntryComponent } from './Dialog/entry/entry.component';
import { RPTComponent } from './Dialog/rpt/rpt.component';
import { ManualupdateSearchComponent } from './Dialog/manualupdate-search/manualupdate-search.component';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [{
  path:'',
  component:ManualUpdateComponent,
  data:{breadcrumb:'Manual Update'}
}]

@NgModule({
  declarations: [
    ManualUpdateComponent,
    EntryComponent,
    RPTComponent,
    ManualupdateSearchComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class ManualUpdateModule { }
