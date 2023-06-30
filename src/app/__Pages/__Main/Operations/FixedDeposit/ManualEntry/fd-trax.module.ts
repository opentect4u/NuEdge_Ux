import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FdTraxComponent } from './fd-trax.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { TrxEntryComponent } from './Dialog/trx-entry/trx-entry.component';
import { TraxRPTComponent } from './Dialog/trax-rpt/trax-rpt.component';
import { CreateInvComponent } from './Dialog/create-inv/create-inv.component';
import { DialogDtlsComponent } from './Dialog/dialog-dtls/dialog-dtls.component';

 const routes: Routes = [{
  path:'',
  component:FdTraxComponent,
  data:{breadcrumb:'FD Trax'},

}]

@NgModule({
  declarations: [
    FdTraxComponent,
    TrxEntryComponent,
    TraxRPTComponent,
    CreateInvComponent,
    DialogDtlsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class FdTraxModule { }
