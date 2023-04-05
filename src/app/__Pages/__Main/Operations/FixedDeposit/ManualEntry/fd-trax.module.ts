import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FdTraxComponent } from './fd-trax.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { TrxEntryComponent } from './Dialog/trx-entry/trx-entry.component';
import { TraxRPTComponent } from './Dialog/trax-rpt/trax-rpt.component';

 const routes: Routes = [{path:'',component:FdTraxComponent}]

@NgModule({
  declarations: [
    FdTraxComponent,
    TrxEntryComponent,
    TraxRPTComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class FdTraxModule { }
