import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManualUpdateComponent } from './manual-update.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { EntryComponent } from './Dialog/entry/entry.component';
import { RPTComponent } from './Dialog/rpt/rpt.component';
import { ManualupdateSearchComponent } from './Dialog/manualupdate-search/manualupdate-search.component';

const routes: Routes = [{path:'',component:ManualUpdateComponent}]

@NgModule({
  declarations: [
    ManualUpdateComponent,
    EntryComponent,
    RPTComponent,
    ManualupdateSearchComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class ManualUpdateModule { }
