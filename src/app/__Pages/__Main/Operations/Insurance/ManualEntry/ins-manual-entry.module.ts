import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InsMaualEntryComponent } from './ins-maual-entry.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { TraxEntryComponent } from './Dialog/trax-entry/trax-entry.component';
import { InsTraxRPTComponent } from './Dialog/ins-trax-rpt/ins-trax-rpt.component';
import { DialogForViewComponent } from './Dialog/dialog-for-view/dialog-for-view.component';

 const routes: Routes = [{
  path:'',
  component:InsMaualEntryComponent
}]

@NgModule({
  declarations: [
    InsMaualEntryComponent,
    TraxEntryComponent,
    InsTraxRPTComponent,
    DialogForViewComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class InsManualEntryModule { }
